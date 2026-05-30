import { prisma } from '../config/database';

/**
 * PostgreSQL ILIKE-based search fallback for when OpenSearch/Elasticsearch is
 * unavailable (e.g. production where OpenSearch is not hosted).
 *
 * Accepts the same params as the OpenSearch query and returns the identical
 * result shape — { jobs, total, page, limit, totalPages } — so callers (and the
 * frontend) cannot tell which backend served the request.
 */
export interface SearchFallbackParams {
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

export const searchFallback = async (params: SearchFallbackParams) => {
  const { query, location, type, remote, salaryMin, salaryMax, skills, page, limit } = params;

  const where: Record<string, unknown> = { status: 'ACTIVE' };

  // Free-text query: match title OR description, case-insensitive (ILIKE)
  if (query) {
    where.OR = [
      { title: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
    ];
  }

  // Location: case-insensitive partial match (ILIKE)
  if (location) where.location = { contains: location, mode: 'insensitive' };

  // Exact filters
  if (type) where.type = type;
  if (remote !== undefined) where.remote = remote;
  if (skills?.length) where.skills = { hasSome: skills };

  // Salary range — mirrors the OpenSearch range filter on the salaryMin field
  if (salaryMin !== undefined || salaryMax !== undefined) {
    where.salaryMin = {
      ...(salaryMin !== undefined && { gte: salaryMin }),
      ...(salaryMax !== undefined && { lte: salaryMax }),
    };
  }

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
