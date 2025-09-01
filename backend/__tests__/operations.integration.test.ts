import request from "supertest";
import { DataSource } from "typeorm";
import jwt from "jsonwebtoken";
import app from "../src/app";
import { AppDataSource } from "../src/data-source";

describe("Operations Integration Tests", () => {
  let dataSource: DataSource;
  let authToken: string;
  const userId = "123e4567-e89b-12d3-a456-426614174000";

  beforeAll(async () => {
    // Configurar base de datos de prueba
    dataSource = AppDataSource;
    await dataSource.initialize();
    await dataSource.runMigrations();

    // Generar token JWT para pruebas
    const jwtSecret = process.env.JWT_SECRET || "test-secret";
    authToken = jwt.sign({ id: userId }, jwtSecret);
  });

  afterAll(async () => {
    // Limpiar base de datos
    await dataSource.dropDatabase();
    await dataSource.destroy();
  });

  beforeEach(async () => {
    // Limpiar datos antes de cada prueba
    await dataSource.getRepository("operations").clear();
  });

  describe("POST /api/operations", () => {
    it("debería crear una operación válida y retornar 201", async () => {
      const operationData = {
        type: "buy",
        amount: 100.5,
        currency: "USD",
      };

      const response = await request(app)
        .post("/api/operations")
        .set("Authorization", `Bearer ${authToken}`)
        .send(operationData)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        type: "buy",
        amount: 100.5,
        currency: "USD",
        createdAt: expect.any(String),
      });

      // Validar que el ID sea un UUID válido
      expect(response.body.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });

    it("debería retornar 400 para monto inválido (<=0)", async () => {
      const operationData = {
        type: "sell",
        amount: -10,
        currency: "EUR",
      };

      const response = await request(app)
        .post("/api/operations")
        .set("Authorization", `Bearer ${authToken}`)
        .send(operationData)
        .expect(400);

      expect(response.body).toMatchObject({
        error: "Error de validación",
        message: expect.stringContaining("mayor a 0"),
      });
    });

    it("debería retornar 400 para tipo de operación inválido", async () => {
      const operationData = {
        type: "invalid",
        amount: 50,
        currency: "USD",
      };

      const response = await request(app)
        .post("/api/operations")
        .set("Authorization", `Bearer ${authToken}`)
        .send(operationData)
        .expect(400);

      expect(response.body).toMatchObject({
        error: "Error de validación",
        message: expect.stringContaining('buy" o "sell'),
      });
    });

    it("debería retornar 400 para moneda inválida", async () => {
      const operationData = {
        type: "buy",
        amount: 25.75,
        currency: "INVALID",
      };

      const response = await request(app)
        .post("/api/operations")
        .set("Authorization", `Bearer ${authToken}`)
        .send(operationData)
        .expect(400);

      expect(response.body).toMatchObject({
        error: "Error de validación",
        message: expect.stringContaining("3 caracteres"),
      });
    });

    it("debería retornar 401 sin token de autorización", async () => {
      const operationData = {
        type: "buy",
        amount: 100,
        currency: "USD",
      };

      const response = await request(app)
        .post("/api/operations")
        .send(operationData)
        .expect(401);

      expect(response.body).toMatchObject({
        error: "Token de autorización requerido",
      });
    });

    it("debería retornar 401 con token inválido", async () => {
      const operationData = {
        type: "buy",
        amount: 100,
        currency: "USD",
      };

      const response = await request(app)
        .post("/api/operations")
        .set("Authorization", "Bearer invalid-token")
        .send(operationData)
        .expect(401);

      expect(response.body).toMatchObject({
        error: "Token inválido",
      });
    });
  });
});
