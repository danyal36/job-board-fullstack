import { Router } from 'express';
import { saveJob, unsaveJob, getSavedJobs } from '../controllers/savedJob.controller';
import { authenticate, authorise } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate, authorise('JOB_SEEKER'));

router.get('/', getSavedJobs);
router.post('/:jobId', saveJob);
router.delete('/:jobId', unsaveJob);

export default router;
