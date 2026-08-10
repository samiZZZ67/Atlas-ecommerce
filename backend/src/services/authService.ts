import bcrypt from 'bcrypt';
import crypto from 'crypto';
import prisma from '../config/prisma';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { sendPasswordResetEmail } from '../utils/email';
import { MESSAGES } from '../constants/messages';

const SALT_ROUNDS = 12;

export const registerUser = async (name: string, email: string, password: string) => {
  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) throw { statusCode: 409, message: MESSAGES.EMAIL_EXISTS };

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: { name, email: email.toLowerCase(), password: hashed },
  });

  const payload = { id: user.id, email: user.email, role: user.role as 'USER' | 'ADMIN' };
  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) throw { statusCode: 401, message: MESSAGES.INVALID_CREDENTIALS };

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw { statusCode: 401, message: MESSAGES.INVALID_CREDENTIALS };

  const payload = { id: user.id, email: user.email, role: user.role as 'USER' | 'ADMIN' };
  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
};

export const refreshTokens = async (refreshToken: string) => {
  const decoded = verifyRefreshToken(refreshToken);
  const user = await prisma.user.findUnique({ where: { id: decoded.id } });
  if (!user) throw { statusCode: 401, message: MESSAGES.INVALID_TOKEN };

  const payload = { id: user.id, email: user.email, role: user.role as 'USER' | 'ADMIN' };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
};

export const forgotPassword = async (email: string, origin: string) => {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) throw { statusCode: 404, message: MESSAGES.USER_NOT_FOUND };

  const token = crypto.randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken: token, resetTokenExpiry: expiry },
  });

  const resetLink = `${origin}/reset-password?token=${token}`;
  await sendPasswordResetEmail(user.email, resetLink);
};

export const resetPassword = async (token: string, newPassword: string) => {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gt: new Date() },
    },
  });
  if (!user) throw { statusCode: 400, message: MESSAGES.INVALID_TOKEN };

  const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed, resetToken: null, resetTokenExpiry: null },
  });
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  if (!user) throw { statusCode: 404, message: MESSAGES.USER_NOT_FOUND };
  return user;
};
