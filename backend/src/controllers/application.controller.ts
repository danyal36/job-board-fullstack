import { Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';
import * as applicationService from '../services/application.service';
import { createApplicationSchema } from '../validators/application.validator';

function parseZodError(err: ZodError): string {
  return err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
}

export const createApplication = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = createApplicationSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(parseZodError(parsed.error), 422);
    const application = await applicationService.createApplication(req.userId!, parsed.data);
    res.status(201).json({ success: true, data: application, message: 'Application submitted' });
  } catch (err) {
    next(err);
  }
};

export const getMyApplications = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const applications = await applicationService.getMyApplications(req.userId!);
    res.json({ success: true, data: applications, message: 'Applications fetched' });
  } catch (err) {
    next(err);
  }
};
