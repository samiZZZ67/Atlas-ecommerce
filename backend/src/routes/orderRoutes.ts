import { Router } from 'express';
import * as orderController from '../controllers/orderController';
import { protect } from '../middlewares/authMiddleware';
import { requireAdmin } from '../middlewares/roleMiddleware';

const router = Router();

router.use(protect);

router.get('/', orderController.getOrders);
router.post('/', orderController.placeOrder);

// Admin only
router.put('/:id/status', requireAdmin, orderController.adminUpdateOrderStatus);

export default router;
