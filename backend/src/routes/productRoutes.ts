import { Router } from 'express';
import * as productController from '../controllers/productController';
import { protect } from '../middlewares/authMiddleware';
import { requireAdmin } from '../middlewares/roleMiddleware';

const router = Router();

// Public
router.get('/', productController.getProducts);
router.get('/categories', productController.getCategories);
router.get('/:slug', productController.getProductBySlug);

// Admin
router.post('/', protect, requireAdmin, productController.adminCreateProduct);
router.put('/:id', protect, requireAdmin, productController.adminUpdateProduct);
router.delete('/:id', protect, requireAdmin, productController.adminDeleteProduct);

export default router;
