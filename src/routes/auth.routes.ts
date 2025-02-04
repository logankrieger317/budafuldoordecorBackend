import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateToken, validateRegistration, validateLogin } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', validateRegistration, AuthController.register);
router.post('/login', validateLogin, AuthController.login);

// Protected routes
router.get('/profile', authenticateToken, AuthController.getProfile);

export default router;
