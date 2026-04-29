import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AuthRequest } from '../middleware/auth.middleware';
import * as jobService from '../services/job.service';
import { createJobSchema, updateJobSchema } from '../validators/job.validator';
import { AppError } from '../middleware/error.middleware';

function parseZodError(err: ZodError): string {
  return err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
}

export const getJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '10', type, remote, location } = req.query;
    const result = await jobService.getJobs({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      type: type as string | undefined,
      remote: remote !== undefined ? remote === 'true' : undefined,
      location: location as string | undefined,
    });
    res.json({ success: true, data: result, message: 'Jobs fetched' });
  } catch (err) {
    next(err);
  }
};

export const getJobById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const job = await jobService.getJobById(req.params.id);
    res.json({ success: true, data: job, message: 'Job fetched' });
  } catch (err) {
    next(err);
  }
};

export const searchJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q, location, type, remote, salaryMin, salaryMax, skills, page = '1', limit = '10' } =
      req.query;
    const result = await jobService.searchJobs({
      query: q as string | undefined,
      location: location as string | undefined,
      type: type as string | undefined,
      remote: remote !== undefined ? remote === 'true' : undefined,
      salaryMin: salaryMin ? parseInt(salaryMin as string) : undefined,
      salaryMax: salaryMax ? parseInt(salaryMax as string) : undefined,
      skills: skills ? (skills as string).split(',') : undefined,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    });
    res.json({ success: true, data: result, message: 'Search results' });
  } catch (err) {
    next(err);
  }
};

export const createJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = createJobSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(parseZodError(parsed.error), 422);
    const job = await jobService.createJob(parsed.data, req.userId!);
    res.status(201).json({ success: true, data: job, message: 'Job created' });
  } catch (err) {
    next(err);
  }
};

export const updateJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = updateJobSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(parseZodError(parsed.error), 422);
    const job = await jobService.updateJob(req.params.id, parsed.data, req.userId!);
    res.json({ success: true, data: job, message: 'Job updated' });
  } catch (err) {
    next(err);
  }
};

export const deleteJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await jobService.deleteJob(req.params.id, req.userId!);
    res.json({ success: true, data: null, message: 'Job deleted' });
  } catch (err) {
    next(err);
  }
};
