import { Request, Response, NextFunction } from 'express';
import * as cartService from '../services/cartService';
import { sendSuccess } from '../utils/response';
import { MESSAGES } from '../constants/messages';

export const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await cartService.getCart(req.user!.id);
    sendSuccess(res, MESSAGES.CART_FETCHED, items);
  } catch (err) { next(err); }
};

export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const item = await cartService.addOrUpdateCartItem(req.user!.id, productId, quantity);
    sendSuccess(res, MESSAGES.CART_UPDATED, item);
  } catch (err) { next(err); }
};

export const updateCartItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const item = await cartService.updateCartItemQty(req.user!.id, productId, quantity);
    sendSuccess(res, MESSAGES.CART_UPDATED, item);
  } catch (err) { next(err); }
};

export const removeFromCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await cartService.removeCartItem(req.user!.id, req.params.productId);
    sendSuccess(res, MESSAGES.CART_UPDATED, {});
  } catch (err) { next(err); }
};

export const clearCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await cartService.clearCart(req.user!.id);
    sendSuccess(res, MESSAGES.CART_CLEARED, {});
  } catch (err) { next(err); }
};
