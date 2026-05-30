import request from 'supertest';

jest.mock('../config/elasticsearch', () => ({
  elasticClient: {
    search: jest.fn(),
    index: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    indices: { exists: jest.fn(), create: jest.fn() },
  },
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
    req.userId = 'seeker-user-id';
    req.userRole = 'JOB_SEEKER';
    next();
  },
  authorise: () => (_req: unknown, _res: unknown, next: () => void) => next(),
}));

import { prisma } from '../config/database';
import app from '../app';

const mockApp = prisma.application as unknown as {
  findUnique: jest.Mock;
  create: jest.Mock;
  findMany: jest.Mock;
};

const mockJob = prisma.job as unknown as { findUnique: jest.Mock };

const JOB_ID = '550e8400-e29b-41d4-a716-446655440000';

const jobFixture = {
  id: JOB_ID,
  status: 'ACTIVE',
  title: 'Engineer',
};

const applicationFixture = {
  id: 'app-1',
  jobId: JOB_ID,
  userId: 'seeker-user-id',
  coverLetter: 'I am very interested in this role and believe my skills match well.',
  status: 'PENDING',
  createdAt: new Date().toISOString(),
  job: { ...jobFixture, company: { id: 'c1', name: 'Acme', logoUrl: null, location: 'London' } },
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('POST /api/applications', () => {
  it('returns 201 on successful application', async () => {
    mockJob.findUnique.mockResolvedValue(jobFixture);
    mockApp.findUnique.mockResolvedValue(null);
    mockApp.create.mockResolvedValue(applicationFixture);

    const res = await request(app)
      .post('/api/applications')
      .set('Authorization', 'Bearer mock-token')
      .send({
        jobId: JOB_ID,
        coverLetter: 'I am very interested in this role and believe my skills match well.',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
  });

  it('returns 409 when already applied', async () => {
    mockJob.findUnique.mockResolvedValue(jobFixture);
    mockApp.findUnique.mockResolvedValue(applicationFixture);

    const res = await request(app)
      .post('/api/applications')
      .set('Authorization', 'Bearer mock-token')
      .send({
        jobId: JOB_ID,
        coverLetter: 'I am very interested in this role and believe my skills match well.',
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });
});

describe('GET /api/applications/my', () => {
  it("returns 200 with user's applications", async () => {
    mockApp.findMany.mockResolvedValue([applicationFixture]);

    const res = await request(app)
      .get('/api/applications/my')
      .set('Authorization', 'Bearer mock-token');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
