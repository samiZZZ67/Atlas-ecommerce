import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';
import { HTTP_STATUS } from '../constants/httpStatus';
import { MESSAGES } from '../constants/messages';

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'ADMIN') {
    sendError(res, MESSAGES.FORBIDDEN, [], HTTP_STATUS.FORBIDDEN);
    return;
  }
  next();
};
