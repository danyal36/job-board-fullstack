import { Router } from 'express';
import { authenticate, authorise } from '../middleware/auth.middleware';

// Company routes placeholder
const companyRouter = Router();
companyRouter.get('/', (_req, res) => res.json({ success: true, data: [], message: 'Companies endpoint' }));
export { companyRouter as default };
