import { Router } from 'express';
import { AuthController } from './auth.controller';

const router = Router();
const authController = new AuthController();

/**
 * POST /auth/login
 * Autenticar usuario y obtener token JWT
 */
router.post('/login', authController.login);

export { router as authRoutes };
