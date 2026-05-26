import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as savedJobService from '../services/savedJob.service';

export const saveJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const saved = await savedJobService.saveJob(req.userId!, req.params.jobId);
    res.status(201).json({ success: true, data: saved, message: 'Job saved' });
  } catch (err) {
    next(err);
  }
};

export const unsaveJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await savedJobService.unsaveJob(req.userId!, req.params.jobId);
    res.json({ success: true, data: null, message: 'Job removed from saved' });
  } catch (err) {
    next(err);
  }
};

export const getSavedJobs = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const saved = await savedJobService.getSavedJobs(req.userId!);
    res.json({ success: true, data: saved, message: 'Saved jobs fetched' });
  } catch (err) {
    next(err);
  }
};
