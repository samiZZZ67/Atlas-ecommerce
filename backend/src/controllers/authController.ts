import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import { sendSuccess } from '../utils/response';
import { HTTP_STATUS } from '../constants/httpStatus';
import { MESSAGES } from '../constants/messages';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    const result = await authService.registerUser(name, email, password);
    sendSuccess(res, MESSAGES.REGISTER_SUCCESS, result, HTTP_STATUS.CREATED);
  } catch (err) { next(err); }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    sendSuccess(res, MESSAGES.LOGIN_SUCCESS, result);
  } catch (err) { next(err); }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshTokens(refreshToken);
    sendSuccess(res, MESSAGES.TOKEN_REFRESHED, result);
  } catch (err) { next(err); }
};

export const logout = (_req: Request, res: Response) => {
  sendSuccess(res, MESSAGES.LOGOUT_SUCCESS, {});
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const origin = req.headers.origin || `http://localhost:5173`;
    await authService.forgotPassword(email, origin as string);
    sendSuccess(res, MESSAGES.FORGOT_PASSWORD_SENT, {});
  } catch (err) { next(err); }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, password } = req.body;
    await authService.resetPassword(token, password);
    sendSuccess(res, MESSAGES.RESET_PASSWORD_SUCCESS, {});
  } catch (err) { next(err); }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getMe(req.user!.id);
    sendSuccess(res, 'User fetched.', user);
  } catch (err) { next(err); }
};
