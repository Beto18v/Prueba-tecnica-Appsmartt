import { Request, Response, NextFunction } from "express";

/**
 * Middleware centralizado para manejo de errores
 * Captura errores no manejados y devuelve respuestas consistentes
 */
export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Error capturado:", error);

  // Error de validación (class-validator o similar)
  if (error.name === "ValidationError" || error.statusCode === 400) {
    res.status(400).json({
      error: "Error de validación",
      message: error.message || "Los datos proporcionados no son válidos",
    });
    return;
  }

  // Error de autenticación
  if (error.statusCode === 401) {
    res.status(401).json({
      error: "No autorizado",
      message: error.message || "Credenciales inválidas",
    });
    return;
  }

  // Error de base de datos
  if (error.name === "QueryFailedError") {
    res.status(500).json({
      error: "Error de base de datos",
      message: "Error interno del servidor",
    });
    return;
  }

  // Error genérico del servidor
  res.status(500).json({
    error: "Error interno del servidor",
    message: "Ocurrió un error inesperado",
  });
};
