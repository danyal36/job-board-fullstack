import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { AppError } from '../middleware/error.middleware';

interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'JOB_SEEKER' | 'EMPLOYER';
}

interface LoginInput {
  email: string;
  password: string;
}

const generateTokens = (userId: string, role: string) => {
  const accessToken = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }
  );
  const refreshToken = jwt.sign(
    { userId, role },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' }
  );
  return { accessToken, refreshToken };
};

export const register = async (input: RegisterInput) => {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new AppError('Email already in use', 409);

  const hashed = await bcrypt.hash(input.password, 12);
  const user = await prisma.user.create({
    data: {
      email: input.email,
      password: hashed,
      firstName: input.firstName,
      lastName: input.lastName,
      role: input.role || 'JOB_SEEKER',
    },
    select: { id: true, email: true, firstName: true, lastName: true, role: true },
  });

  const tokens = generateTokens(user.id, user.role);
  return { user, ...tokens };
};

export const login = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) throw new AppError('Invalid credentials', 401);

  const valid = await bcrypt.compare(input.password, user.password);
  if (!valid) throw new AppError('Invalid credentials', 401);

  const tokens = generateTokens(user.id, user.role);
  const { password: _, ...safeUser } = user;
  return { user: safeUser, ...tokens };
};

export const refresh = async (token: string) => {
  if (!token) throw new AppError('Refresh token required', 400);

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as {
      userId: string;
      role: string;
    };
    const tokens = generateTokens(decoded.userId, decoded.role);
    return tokens;
  } catch {
    throw new AppError('Invalid refresh token', 401);
  }
};

export const getById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true },
  });
  if (!user) throw new AppError('User not found', 404);
  return user;
};
