import { Router } from 'express';
import * as authController from '../controllers/authController';
import { protect } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validationMiddleware';
import { authLimiter } from '../middlewares/rateLimiter';
import { body } from 'express-validator';

const router = Router();

router.post('/register', authLimiter,
  [
    body('name').notEmpty().withMessage('Name is required.'),
    body('email').isEmail().withMessage('Valid email required.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  ],
  validate,
  authController.register
);

router.post('/login', authLimiter,
  [
    body('email').isEmail().withMessage('Valid email required.'),
    body('password').notEmpty().withMessage('Password is required.'),
  ],
  validate,
  authController.login
);

router.post('/refresh',
  [body('refreshToken').notEmpty().withMessage('Refresh token required.')],
  validate,
  authController.refresh
);

router.post('/logout', protect, authController.logout);

router.post('/forgot',
  [body('email').isEmail().withMessage('Valid email required.')],
  validate,
  authController.forgotPassword
);

router.post('/reset',
  [
    body('token').notEmpty().withMessage('Token required.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  ],
  validate,
  authController.resetPassword
);

router.get('/me', protect, authController.getMe);

export default router;
