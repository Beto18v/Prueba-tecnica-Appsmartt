import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * POST /api/auth/login
   * Autentica un usuario y retorna un token JWT
   */
  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Transformar y validar DTO
      const loginDto = plainToClass(LoginDto, req.body);
      const errors = await validate(loginDto);

      if (errors.length > 0) {
        const errorMessages = errors
          .map((error: any) =>
            Object.values(error.constraints || {}).join(', ')
          )
          .join('; ');

        res.status(400).json({
          error: 'Error de validación',
          message: errorMessages,
        });
        return;
      }

      // Intentar autenticar
      const result = await this.authService.login(
        loginDto.email,
        loginDto.password
      );

      // Respuesta exitosa
      res.status(200).json(result);
    } catch (error: any) {
      // Manejar error de credenciales inválidas específicamente
      if (error.message === 'Credenciales inválidas') {
        res.status(401).json({
          message: 'Credenciales inválidas',
        });
        return;
      }

      // Pasar otros errores al middleware de manejo de errores
      next(error);
    }
  };
}
