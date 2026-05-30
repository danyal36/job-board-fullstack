import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { errorHandler } from './middleware/error.middleware';
import { notFound } from './middleware/notFound.middleware';
import authRoutes from './routes/auth.routes';
import jobRoutes from './routes/job.routes';
import companyRoutes from './routes/company.routes';
import applicationRoutes from './routes/application.routes';
import savedJobRoutes from './routes/savedJob.routes';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' }, message: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/saved-jobs', savedJobRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
