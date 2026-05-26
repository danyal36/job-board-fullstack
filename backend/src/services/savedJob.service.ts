import { prisma } from '../config/database';
import { AppError } from '../middleware/error.middleware';

export const saveJob = async (userId: string, jobId: string) => {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) throw new AppError('Job not found', 404);

  // Idempotent: re-saving an already-saved job is a no-op.
  return prisma.savedJob.upsert({
    where: { jobId_userId: { jobId, userId } },
    update: {},
    create: { jobId, userId },
  });
};

export const unsaveJob = async (userId: string, jobId: string) => {
  const existing = await prisma.savedJob.findUnique({
    where: { jobId_userId: { jobId, userId } },
  });
  if (!existing) throw new AppError('Saved job not found', 404);

  await prisma.savedJob.delete({ where: { jobId_userId: { jobId, userId } } });
};

export const getSavedJobs = async (userId: string) => {
  return prisma.savedJob.findMany({
    where: { userId },
    include: {
      job: {
        include: { company: { select: { id: true, name: true, logoUrl: true, location: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};
