import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../config';
import { AuthUser } from '../types/express.d';

export const signAccessToken = (payload: AuthUser): string => {
  const opts: SignOptions = { expiresIn: config.jwtExpiry as SignOptions['expiresIn'] };
  return jwt.sign(payload as object, config.jwtSecret, opts);
};

export const signRefreshToken = (payload: AuthUser): string => {
  const opts: SignOptions = { expiresIn: config.jwtRefreshExpiry as SignOptions['expiresIn'] };
  return jwt.sign(payload as object, config.jwtRefreshSecret, opts);
};

export const verifyAccessToken = (token: string): AuthUser => {
  return jwt.verify(token, config.jwtSecret) as AuthUser;
};

export const verifyRefreshToken = (token: string): AuthUser => {
  return jwt.verify(token, config.jwtRefreshSecret) as AuthUser;
};
