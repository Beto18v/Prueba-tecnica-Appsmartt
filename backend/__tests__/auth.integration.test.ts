import request from "supertest";
import { DataSource } from "typeorm";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import app from "../src/app";
import { AppDataSource } from "../src/data-source";
import { User } from "../src/entities/User";

describe("Auth Integration Tests", () => {
  let dataSource: DataSource;
  const testUser = {
    email: "test@example.com",
    password: "Password123!",
  };

  beforeAll(async () => {
    // Configurar base de datos de prueba
    dataSource = AppDataSource;
    await dataSource.initialize();
    await dataSource.runMigrations();

    // Crear usuario de prueba
    const userRepository = dataSource.getRepository(User);
    const hashedPassword = await bcrypt.hash(testUser.password, 10);

    const user = userRepository.create({
      email: testUser.email,
      password: hashedPassword,
    });

    await userRepository.save(user);
  });

  afterAll(async () => {
    // Limpiar base de datos
    await dataSource.dropDatabase();
    await dataSource.destroy();
  });

  describe("POST /api/auth/login", () => {
    it("debería retornar 200 y token con credenciales correctas", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty("token");
      expect(typeof response.body.token).toBe("string");

      // Verificar que el token sea válido
      const jwtSecret = process.env.JWT_SECRET || "test-secret";
      const decoded = jwt.verify(response.body.token, jwtSecret) as any;
      expect(decoded).toHaveProperty("id");
      expect(typeof decoded.id).toBe("string");
    });

    it('debería retornar 401 y mensaje "Credenciales inválidas" con email incorrecto', async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "wrong@example.com",
          password: testUser.password,
        })
        .expect(401);

      expect(response.body).toEqual({
        message: "Credenciales inválidas",
      });
    });

    it('debería retornar 401 y mensaje "Credenciales inválidas" con contraseña incorrecta', async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: "WrongPassword123!",
        })
        .expect(401);

      expect(response.body).toEqual({
        message: "Credenciales inválidas",
      });
    });

    it("debería retornar 400 con email inválido", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "invalid-email",
          password: testUser.password,
        })
        .expect(400);

      expect(response.body).toMatchObject({
        error: "Error de validación",
        message: expect.stringContaining("formato válido"),
      });
    });

    it("debería retornar 400 con campos faltantes", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          // password faltante
        })
        .expect(400);

      expect(response.body).toMatchObject({
        error: "Error de validación",
        message: expect.stringContaining("requerida"),
      });
    });
  });
});
