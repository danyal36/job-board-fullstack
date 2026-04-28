import { prisma } from '../config/database';
import { elasticClient, JOB_INDEX } from '../config/elasticsearch';
import { AppError } from '../middleware/error.middleware';

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
  const where: any = { status: 'ACTIVE' };
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
  const from = (page - 1) * limit;

  const must: any[] = [{ term: { status: 'ACTIVE' } }];
  const filter: any[] = [];

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
  if (salaryMin || salaryMax) {
    filter.push({
      range: {
        salaryMin: {
          ...(salaryMin && { gte: salaryMin }),
          ...(salaryMax && { lte: salaryMax }),
        },
      },
    });
  }

  const response = await elasticClient.search({
    index: JOB_INDEX,
    from,
    size: limit,
    query: { bool: { must, filter } },
    sort: [{ _score: 'desc' }, { createdAt: 'desc' }],
  });

  const hits = response.hits.hits;
  const total = typeof response.hits.total === 'number'
    ? response.hits.total
    : response.hits.total?.value ?? 0;

  return {
    jobs: hits.map(h => h._source),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const createJob = async (data: any, userId: string) => {
  const company = await prisma.company.findUnique({ where: { ownerId: userId } });
  if (!company) throw new AppError('You must create a company first', 400);

  const job = await prisma.job.create({
    data: { ...data, companyId: company.id },
    include: { company: { select: { name: true } } },
  });

  // Index in Elasticsearch
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

export const updateJob = async (id: string, data: any, userId: string) => {
  const job = await prisma.job.findUnique({
    where: { id },
    include: { company: true },
  });
  if (!job) throw new AppError('Job not found', 404);
  if (job.company.ownerId !== userId) throw new AppError('Not authorised', 403);

  const updated = await prisma.job.update({ where: { id }, data });

  // Update Elasticsearch
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

  // Remove from Elasticsearch
  await elasticClient.delete({ index: JOB_INDEX, id });
};
