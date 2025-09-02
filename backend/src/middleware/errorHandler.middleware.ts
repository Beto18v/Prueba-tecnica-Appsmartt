import { Request, Response, NextFunction } from 'express';

/**
 * Middleware centralizado para manejo de errores
 * Captura errores no manejados y devuelve respuestas consistentes
 */

interface CustomError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error capturado:', error);

  // Error de validación
  if (error.name === 'ValidationError' || error.statusCode === 400) {
    res.status(400).json({
      error: 'Error de validación',
      message: error.message,
    });
    return;
  }

  // Error de autenticación
  if (error.statusCode === 401) {
    res.status(401).json({
      error: 'No autorizado',
      message: error.message || 'Token inválido o expirado',
    });
    return;
  }

  // Error del servidor
  res.status(500).json({
    error: 'Error interno del servidor',
    message: 'Algo salió mal. Inténtalo de nuevo más tarde.',
  });
};
