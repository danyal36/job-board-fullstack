import { prisma } from '../config/database';
import { AppError } from '../middleware/error.middleware';
import type { CreateApplicationInput } from '../validators/application.validator';

const jobInclude = {
  job: {
    include: { company: { select: { id: true, name: true, logoUrl: true, location: true } } },
  },
} as const;

export const createApplication = async (userId: string, data: CreateApplicationInput) => {
  const job = await prisma.job.findUnique({ where: { id: data.jobId } });
  if (!job) throw new AppError('Job not found', 404);
  if (job.status !== 'ACTIVE') throw new AppError('This job is no longer accepting applications', 400);

  const existing = await prisma.application.findUnique({
    where: { jobId_userId: { jobId: data.jobId, userId } },
  });
  if (existing) throw new AppError('You have already applied to this job', 409);

  return prisma.application.create({
    data: { jobId: data.jobId, userId, coverLetter: data.coverLetter },
    include: jobInclude,
  });
};

export const getMyApplications = async (userId: string) => {
  return prisma.application.findMany({
    where: { userId },
    include: jobInclude,
    orderBy: { createdAt: 'desc' },
  });
};
