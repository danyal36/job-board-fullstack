import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { errorHandler } from './middleware/error.middleware';
import { notFound } from './middleware/notFound.middleware';
import { createJobIndex } from './config/elasticsearch';
import authRoutes from './routes/auth.routes';
import jobRoutes from './routes/job.routes';
import companyRoutes from './routes/company.routes';
import applicationRoutes from './routes/application.routes';
import savedJobRoutes from './routes/savedJob.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' }, message: 'Server is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/saved-jobs', savedJobRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  createJobIndex().catch(err => console.error('ES index init failed:', err.message));
});

export default app;
