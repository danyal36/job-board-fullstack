import { z } from 'zod';

export const createApplicationSchema = z.object({
  jobId: z.string().uuid({ message: 'A valid jobId is required' }),
  coverLetter: z.string().trim().min(50).max(2000).optional(),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
