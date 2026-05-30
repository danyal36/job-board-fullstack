import request from 'supertest';

const mockElasticClient = {
  search: jest.fn(),
  index: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  indices: { exists: jest.fn(), create: jest.fn() },
};

jest.mock('../config/elasticsearch', () => ({
  elasticClient: mockElasticClient,
  JOB_INDEX: 'jobs',
  createJobIndex: jest.fn(),
}));

jest.mock('../config/database', () => ({
  prisma: {
    user: { findUnique: jest.fn(), create: jest.fn() },
    job: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    company: { findUnique: jest.fn(), create: jest.fn() },
    application: { findUnique: jest.fn(), create: jest.fn(), findMany: jest.fn() },
  },
}));

jest.mock('../middleware/auth.middleware', () => ({
  authenticate: (req: Record<string, unknown>, _res: unknown, next: () => void) => {
    req.userId = 'employer-user-id';
    req.userRole = 'EMPLOYER';
    next();
  },
  authorise: () => (_req: unknown, _res: unknown, next: () => void) => next(),
}));

import { prisma } from '../config/database';
import app from '../app';

const db = prisma as unknown as {
  job: {
    findMany: jest.Mock;
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    count: jest.Mock;
  };
  company: { findUnique: jest.Mock };
};

const mockJob = {
  id: 'job-1',
  title: 'Software Engineer',
  description: 'A great role',
  requirements: [],
  skills: ['TypeScript'],
  location: 'London',
  remote: false,
  salaryMin: 60000,
  salaryMax: 80000,
  currency: 'GBP',
  type: 'FULL_TIME',
  status: 'ACTIVE',
  companyId: 'company-1',
  createdAt: new Date().toISOString(),
  company: { name: 'Acme Ltd', logoUrl: null },
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /api/jobs/search', () => {
  it('returns 200 with jobs array and pagination meta', async () => {
    mockElasticClient.search.mockResolvedValue({
      hits: {
        total: { value: 1 },
        hits: [{ _source: mockJob }],
      },
    });

    const res = await request(app).get('/api/jobs/search?q=engineer');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.jobs)).toBe(true);
    expect(res.body.data).toHaveProperty('total');
    expect(res.body.data).toHaveProperty('totalPages');
  });
});

describe('GET /api/jobs/:id', () => {
  it('returns 200 with job when found', async () => {
    db.job.findUnique.mockResolvedValue(mockJob);

    const res = await request(app).get('/api/jobs/job-1');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe('job-1');
  });

  it('returns 404 when job not found', async () => {
    db.job.findUnique.mockResolvedValue(null);

    const res = await request(app).get('/api/jobs/nonexistent');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe('POST /api/jobs', () => {
  it('returns 201 with created job', async () => {
    db.company.findUnique.mockResolvedValue({ id: 'company-1', ownerId: 'employer-user-id' });
    db.job.create.mockResolvedValue({ ...mockJob, company: { name: 'Acme Ltd' } });
    mockElasticClient.index.mockResolvedValue({});

    const res = await request(app)
      .post('/api/jobs')
      .set('Authorization', 'Bearer mock-token')
      .send({
        title: 'Software Engineer',
        description: 'A great role for the right candidate',
        location: 'London',
        type: 'FULL_TIME',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
  });
});

describe('PUT /api/jobs/:id', () => {
  it('returns 200 with updated job', async () => {
    db.job.findUnique.mockResolvedValue({
      ...mockJob,
      company: { ownerId: 'employer-user-id' },
    });
    db.job.update.mockResolvedValue({ ...mockJob, title: 'Updated Title' });
    mockElasticClient.update.mockResolvedValue({});

    const res = await request(app)
      .put('/api/jobs/job-1')
      .set('Authorization', 'Bearer mock-token')
      .send({ title: 'Updated Title' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('DELETE /api/jobs/:id', () => {
  it('returns 200 on success', async () => {
    db.job.findUnique.mockResolvedValue({
      ...mockJob,
      company: { ownerId: 'employer-user-id' },
    });
    db.job.delete.mockResolvedValue({});
    mockElasticClient.delete.mockResolvedValue({});

    const res = await request(app)
      .delete('/api/jobs/job-1')
      .set('Authorization', 'Bearer mock-token');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
