import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { User } from "../../entities/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  /**
   * Autentica un usuario con email y contraseña
   * Retorna token JWT si las credenciales son válidas
   */
  async login(email: string, password: string): Promise<{ token: string }> {
    try {
      // Buscar usuario por email
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new Error("Credenciales inválidas");
      }

      // Comparar contraseña
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new Error("Credenciales inválidas");
      }

      // Generar token JWT
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error("JWT_SECRET no está configurado");
      }

      const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: "24h" });

      return { token };
    } catch (error) {
      // Re-lanzar el error para mantener el mensaje exacto
      throw error;
    }
  }

  /**
   * Busca un usuario por email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }
}
