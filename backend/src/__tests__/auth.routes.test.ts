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
    user: { findUnique: jest.fn(), create: jest.fn(), findMany: jest.fn() },
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

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn(),
}));

import bcrypt from 'bcryptjs';
import { prisma } from '../config/database';
import app from '../app';

const mockUser = prisma.user as unknown as {
  findUnique: jest.Mock;
  create: jest.Mock;
};

const bcryptCompare = bcrypt.compare as jest.Mock;

const registeredUser = {
  id: 'user-1',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'JOB_SEEKER' as const,
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('POST /api/auth/register', () => {
  it('returns 201 with user and tokens on success', async () => {
    mockUser.findUnique.mockResolvedValue(null);
    mockUser.create.mockResolvedValue(registeredUser);

    const res = await request(app).post('/api/auth/register').send({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data).toHaveProperty('user');
  });

  it('returns 409 on duplicate email', async () => {
    mockUser.findUnique.mockResolvedValue(registeredUser);

    const res = await request(app).post('/api/auth/register').send({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });
});

describe('POST /api/auth/login', () => {
  it('returns 200 with token on valid credentials', async () => {
    mockUser.findUnique.mockResolvedValue({
      ...registeredUser,
      password: 'hashed-password',
    });
    bcryptCompare.mockResolvedValue(true);

    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('accessToken');
  });

  it('returns 401 on invalid credentials', async () => {
    mockUser.findUnique.mockResolvedValue({
      ...registeredUser,
      password: 'hashed-password',
    });
    bcryptCompare.mockResolvedValue(false);

    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'wrong-password',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('returns 401 when user does not exist', async () => {
    mockUser.findUnique.mockResolvedValue(null);

    const res = await request(app).post('/api/auth/login').send({
      email: 'nobody@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
