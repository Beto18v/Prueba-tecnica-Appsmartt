import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { OperationsService } from "./operations.service";
import { CreateOperationDto } from "./dtos/create-operation.dto";
import { AuthenticatedRequest } from "../../types";

export class OperationsController {
  private operationsService: OperationsService;

  constructor() {
    this.operationsService = new OperationsService();
  }

  /**
   * POST /api/operations
   * Crea una nueva operación
   */
  createOperation = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Validar autenticación
      if (!req.user?.id) {
        res.status(401).json({
          error: "Usuario no autenticado",
          message: "Se requiere autenticación válida",
        });
        return;
      }

      // Transformar y validar DTO
      const createOperationDto = plainToClass(CreateOperationDto, req.body);
      const errors = await validate(createOperationDto);

      if (errors.length > 0) {
        const errorMessages = errors
          .map((error: any) =>
            Object.values(error.constraints || {}).join(", ")
          )
          .join("; ");

        res.status(400).json({
          error: "Error de validación",
          message: errorMessages,
          details: errors,
        });
        return;
      }

      // Crear operación
      const operation = await this.operationsService.createOperation(
        {
          type: createOperationDto.type,
          amount: createOperationDto.amount,
          currency: createOperationDto.currency,
        },
        req.user.id
      );

      // Respuesta exitosa
      res.status(201).json(operation);
    } catch (error: any) {
      // Manejar errores específicos
      if (
        error.message?.includes("Moneda no soportada") ||
        error.message?.includes("El monto debe ser mayor a 0")
      ) {
        res.status(400).json({
          error: "Error de validación",
          message: error.message,
        });
        return;
      }

      // Pasar error al middleware de manejo de errores
      next(error);
    }
  };
}
