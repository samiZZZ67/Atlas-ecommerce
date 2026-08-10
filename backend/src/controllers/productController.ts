import { Request, Response, NextFunction } from 'express';
import * as productService from '../services/productService';
import { sendSuccess } from '../utils/response';
import { MESSAGES } from '../constants/messages';
import { HTTP_STATUS } from '../constants/httpStatus';
import prisma from '../config/prisma';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, search, sort, filter, sale, page, limit } = req.query as Record<string, string>;
    const result = await productService.getProducts({
      category,
      search,
      sort,
      filter,
      sale,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
    sendSuccess(res, MESSAGES.PRODUCTS_FETCHED, result);
  } catch (err) { next(err); }
};

export const getProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.getProductBySlug(req.params.slug);
    sendSuccess(res, MESSAGES.PRODUCT_FETCHED, product);
  } catch (err) { next(err); }
};

export const getCategories = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.category.findMany();
    sendSuccess(res, MESSAGES.CATEGORIES_FETCHED, categories);
  } catch (err) { next(err); }
};

export const adminCreateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.createProduct(req.body);
    sendSuccess(res, MESSAGES.PRODUCT_CREATED, product, HTTP_STATUS.CREATED);
  } catch (err) { next(err); }
};

export const adminUpdateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    sendSuccess(res, MESSAGES.PRODUCT_UPDATED, product);
  } catch (err) { next(err); }
};

export const adminDeleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await productService.deleteProduct(req.params.id);
    sendSuccess(res, MESSAGES.PRODUCT_DELETED, {});
  } catch (err) { next(err); }
};
