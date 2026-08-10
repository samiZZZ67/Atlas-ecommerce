import { Router } from 'express';
import * as cartController from '../controllers/cartController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.put('/:productId', cartController.updateCartItem);
router.delete('/clear', cartController.clearCart);
router.delete('/:productId', cartController.removeFromCart);

export default router;
