import { Router } from 'express';
import { authenticateUser } from '../middleware/auth.middleware';
import { validate, loginValidation, registerValidation } from '../middleware/validation.middleware';
import { login, register, getProfile, updateProfile } from '../controllers/auth.controller';

const router = Router();

router.post('/login', validate(loginValidation), login);
router.post('/register', validate(registerValidation), register);
router.get('/profile', authenticateUser, getProfile);
router.put('/profile', authenticateUser, validate([]), updateProfile);

export default router;
