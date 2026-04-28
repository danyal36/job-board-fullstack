import { Router } from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  searchJobs,
} from '../controllers/job.controller';
import { authenticate, authorise } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getJobs);
router.get('/search', searchJobs);
router.get('/:id', getJobById);
router.post('/', authenticate, authorise('EMPLOYER', 'ADMIN'), createJob);
router.put('/:id', authenticate, authorise('EMPLOYER', 'ADMIN'), updateJob);
router.delete('/:id', authenticate, authorise('EMPLOYER', 'ADMIN'), deleteJob);

export default router;
