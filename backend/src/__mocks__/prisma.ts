export const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
  },
  job: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  company: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  application: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
  },
};
