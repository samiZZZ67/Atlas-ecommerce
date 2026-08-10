import { Router } from 'express';
import { uploadFile, deleteFile } from '../controllers/uploadController';
import { protect } from '../middlewares/authMiddleware';
import { requireAdmin } from '../middlewares/roleMiddleware';
import { upload } from '../middlewares/uploadMiddleware';

const router = Router();

router.use(protect, requireAdmin);

router.post('/', upload.single('file'), uploadFile);
router.delete('/', deleteFile);

export default router;
