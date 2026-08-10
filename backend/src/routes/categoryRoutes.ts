import { Router } from 'express';
import prisma from '../config/prisma';
import { sendSuccess } from '../utils/response';
import { MESSAGES } from '../constants/messages';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const categories = await prisma.category.findMany();
    sendSuccess(res, MESSAGES.CATEGORIES_FETCHED, categories);
  } catch (err) { next(err); }
});

export default router;
