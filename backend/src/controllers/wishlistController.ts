import { Request, Response, NextFunction } from 'express';
import * as wishlistService from '../services/wishlistService';
import { sendSuccess } from '../utils/response';
import { MESSAGES } from '../constants/messages';

export const getWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productIds = await wishlistService.getWishlist(req.user!.id);
    sendSuccess(res, MESSAGES.WISHLIST_FETCHED, productIds);
  } catch (err) { next(err); }
};

export const toggleWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await wishlistService.toggleWishlist(req.user!.id, req.params.productId);
    sendSuccess(res, MESSAGES.WISHLIST_UPDATED, result);
  } catch (err) { next(err); }
};
