import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../types";

/**
 * Middleware de autenticación JWT
 * Valida el token Bearer y agrega el usuario a req.user
 */
export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        error: "Token de autorización requerido",
        message:
          "Proporciona un token Bearer válido en el header Authorization",
      });
      return;
    }

    const token = authHeader.substring(7); // Remover 'Bearer '
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error("JWT_SECRET no está configurado");
      res.status(500).json({
        error: "Error de configuración del servidor",
      });
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as { id: string };

    if (!decoded.id) {
      res.status(401).json({
        error: "Token inválido",
        message: "El token no contiene un ID de usuario válido",
      });
      return;
    }

    req.user = { id: decoded.id };
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        error: "Token inválido",
        message: "El token proporcionado no es válido",
      });
    } else {
      console.error("Error en autenticación:", error);
      res.status(500).json({
        error: "Error interno del servidor",
      });
    }
  }
};
