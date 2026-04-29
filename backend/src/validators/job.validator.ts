import { z } from 'zod';

const jobTypeEnum = z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'INTERNSHIP']);
const jobStatusEnum = z.enum(['ACTIVE', 'CLOSED', 'DRAFT']);

export const createJobSchema = z
  .object({
    title: z.string().min(3).max(200),
    description: z.string().min(10),
    requirements: z.array(z.string()).default([]),
    skills: z.array(z.string()).default([]),
    location: z.string().min(1),
    remote: z.boolean().default(false),
    salaryMin: z.number().int().positive().optional(),
    salaryMax: z.number().int().positive().optional(),
    currency: z.string().default('GBP'),
    type: jobTypeEnum.default('FULL_TIME'),
    status: jobStatusEnum.default('ACTIVE'),
    expiresAt: z.string().datetime().optional(),
  })
  .refine(
    d => !(d.salaryMin && d.salaryMax && d.salaryMax < d.salaryMin),
    { message: 'salaryMax must be >= salaryMin', path: ['salaryMax'] },
  );

export const updateJobSchema = z
  .object({
    title: z.string().min(3).max(200).optional(),
    description: z.string().min(10).optional(),
    requirements: z.array(z.string()).optional(),
    skills: z.array(z.string()).optional(),
    location: z.string().min(1).optional(),
    remote: z.boolean().optional(),
    salaryMin: z.number().int().positive().optional(),
    salaryMax: z.number().int().positive().optional(),
    currency: z.string().optional(),
    type: jobTypeEnum.optional(),
    status: jobStatusEnum.optional(),
    expiresAt: z.string().datetime().optional(),
  })
  .refine(
    d => !(d.salaryMin && d.salaryMax && d.salaryMax < d.salaryMin),
    { message: 'salaryMax must be >= salaryMin', path: ['salaryMax'] },
  );

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
