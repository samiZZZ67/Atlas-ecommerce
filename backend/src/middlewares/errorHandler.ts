import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export interface AppError extends Error {
  statusCode?: number;
  errors?: string[];
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  console.error('[Error]', err.message, err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong. Please try again.';
  const errors = err.errors || [];

  sendError(res, message, errors, statusCode);
};

export const notFound = (req: Request, res: Response): void => {
  sendError(res, `Route ${req.originalUrl} not found.`, [], 404);
};
