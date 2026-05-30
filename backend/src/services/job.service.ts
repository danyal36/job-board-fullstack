import type { QueryDslQueryContainer, SortCombinations } from '@elastic/elasticsearch/lib/api/types';
import { prisma } from '../config/database';
import { elasticClient, JOB_INDEX } from '../config/elasticsearch';
import { AppError } from '../middleware/error.middleware';
import { searchFallback } from '../utils/searchFallback';
import type { CreateJobInput, UpdateJobInput } from '../validators/job.validator';

interface GetJobsParams {
  page: number;
  limit: number;
  type?: string;
  remote?: boolean;
  location?: string;
}

interface SearchJobsParams {
  query?: string;
  location?: string;
  type?: string;
  remote?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  skills?: string[];
  page: number;
  limit: number;
}

export const getJobs = async ({ page, limit, type, remote, location }: GetJobsParams) => {
  const where: Record<string, unknown> = { status: 'ACTIVE' };
  if (type) where.type = type;
  if (remote !== undefined) where.remote = remote;
  if (location) where.location = { contains: location, mode: 'insensitive' };

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      include: { company: { select: { name: true, logoUrl: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.job.count({ where }),
  ]);

  return { jobs, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getJobsByOwner = async (userId: string) => {
  const company = await prisma.company.findUnique({ where: { ownerId: userId } });
  if (!company) return { jobs: [], total: 0 };

  const jobs = await prisma.job.findMany({
    where: { companyId: company.id },
    include: {
      company: { select: { name: true, logoUrl: true } },
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return {
    jobs: jobs.map((j: (typeof jobs)[number]) => {
      const { _count, ...rest } = j;
      return { ...rest, applicantCount: _count.applications };
    }),
    total: jobs.length,
  };
};

export const getJobById = async (id: string) => {
  const job = await prisma.job.findUnique({
    where: { id },
    include: { company: true },
  });
  if (!job) throw new AppError('Job not found', 404);
  return job;
};

export const searchJobs = async (params: SearchJobsParams) => {
  const { query, location, type, remote, salaryMin, salaryMax, skills, page, limit } = params;

  // In production without a hosted OpenSearch instance, skip the connection
  // attempt entirely and serve results straight from PostgreSQL.
  if (process.env.NODE_ENV === 'production' && !process.env.ELASTICSEARCH_URL) {
    return searchFallback(params);
  }

  const from = (page - 1) * limit;

  const must: QueryDslQueryContainer[] = [{ term: { status: 'ACTIVE' } }];
  const filter: QueryDslQueryContainer[] = [];

  if (query) {
    must.push({
      multi_match: {
        query,
        fields: ['title^3', 'description^2', 'skills^2', 'requirements', 'companyName'],
        fuzziness: 'AUTO',
      },
    });
  }

  if (type) filter.push({ term: { type } });
  if (remote !== undefined) filter.push({ term: { remote } });
  if (location) filter.push({ match: { location } });
  if (skills?.length) filter.push({ terms: { skills } });
  if (salaryMin !== undefined || salaryMax !== undefined) {
    filter.push({
      range: {
        salaryMin: {
          ...(salaryMin !== undefined && { gte: salaryMin }),
          ...(salaryMax !== undefined && { lte: salaryMax }),
        },
      },
    });
  }

  try {
    const response = await elasticClient.search({
      index: JOB_INDEX,
      from,
      size: limit,
      query: { bool: { must, filter } },
      sort: [{ _score: 'desc' }, { createdAt: 'desc' }] as SortCombinations[],
    });

    const hits = response.hits.hits;
    const total =
      typeof response.hits.total === 'number'
        ? response.hits.total
        : (response.hits.total?.value ?? 0);

    return {
      jobs: hits.map(h => h._source),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch {
    // OpenSearch unreachable (connection refused, unavailable, etc.) — fall back
    // to PostgreSQL so search keeps working. Response shape is identical.
    console.warn('OpenSearch unavailable, falling back to PostgreSQL search');
    return searchFallback(params);
  }
};

export const createJob = async (data: CreateJobInput, userId: string) => {
  const company = await prisma.company.findUnique({ where: { ownerId: userId } });
  if (!company) throw new AppError('You must create a company first', 400);

  const job = await prisma.job.create({
    data: { ...data, companyId: company.id },
    include: { company: { select: { name: true } } },
  });

  await elasticClient.index({
    index: JOB_INDEX,
    id: job.id,
    document: {
      id: job.id,
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      skills: job.skills,
      location: job.location,
      remote: job.remote,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      currency: job.currency,
      type: job.type,
      status: job.status,
      companyId: job.companyId,
      companyName: job.company.name,
      createdAt: job.createdAt,
    },
  });

  return job;
};

export const updateJob = async (id: string, data: UpdateJobInput, userId: string) => {
  const job = await prisma.job.findUnique({
    where: { id },
    include: { company: true },
  });
  if (!job) throw new AppError('Job not found', 404);
  if (job.company.ownerId !== userId) throw new AppError('Not authorised', 403);

  const updated = await prisma.job.update({ where: { id }, data });

  await elasticClient.update({
    index: JOB_INDEX,
    id,
    doc: { ...data },
  });

  return updated;
};

export const deleteJob = async (id: string, userId: string) => {
  const job = await prisma.job.findUnique({
    where: { id },
    include: { company: true },
  });
  if (!job) throw new AppError('Job not found', 404);
  if (job.company.ownerId !== userId) throw new AppError('Not authorised', 403);

  await prisma.job.delete({ where: { id } });

  await elasticClient.delete({ index: JOB_INDEX, id });
};
