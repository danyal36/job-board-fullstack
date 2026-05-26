import { Router } from 'express';
import { createApplication, getMyApplications } from '../controllers/application.controller';
import { authenticate, authorise } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, authorise('JOB_SEEKER'), createApplication);
router.get('/my', authenticate, authorise('JOB_SEEKER'), getMyApplications);

export default router;
