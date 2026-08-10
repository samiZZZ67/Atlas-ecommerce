import { Router } from 'express';
import * as wishlistController from '../controllers/wishlistController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', wishlistController.getWishlist);
router.post('/:productId', wishlistController.toggleWishlist);

export default router;
