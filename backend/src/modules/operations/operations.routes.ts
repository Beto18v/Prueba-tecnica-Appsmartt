import { Router } from 'express';
import { OperationsController } from './operations.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const operationsController = new OperationsController();

/**
 * POST /operations
 * Crear una nueva operación
 * Requiere autenticación JWT
 */
router.post(
  '/operations',
  authMiddleware,
  operationsController.createOperation
);

export { router as operationsRoutes };
