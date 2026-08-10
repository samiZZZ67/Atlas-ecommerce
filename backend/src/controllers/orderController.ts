import { Request, Response, NextFunction } from 'express';
import * as orderService from '../services/orderService';
import { sendSuccess } from '../utils/response';
import { MESSAGES } from '../constants/messages';
import { HTTP_STATUS } from '../constants/httpStatus';

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await orderService.getUserOrders(req.user!.id);
    sendSuccess(res, MESSAGES.ORDERS_FETCHED, orders);
  } catch (err) { next(err); }
};

export const placeOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { address, paymentLast4 } = req.body;
    const order = await orderService.placeOrder(req.user!.id, address, paymentLast4);
    sendSuccess(res, MESSAGES.ORDER_CREATED, order, HTTP_STATUS.CREATED);
  } catch (err) { next(err); }
};

export const adminUpdateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
    sendSuccess(res, MESSAGES.ORDER_UPDATED, order);
  } catch (err) { next(err); }
};
