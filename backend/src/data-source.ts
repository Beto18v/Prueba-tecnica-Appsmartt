import "dotenv/config";
import { DataSource } from "typeorm";
import { Operation } from "./entities/Operation";
import { User } from "./entities/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "Nicolas0318-",
  database: process.env.DB_DATABASE || "prueba_tecnica",
  synchronize: false, // Usar migraciones en lugar de sync automático
  logging: process.env.NODE_ENV === "development",
  entities: [Operation, User],
  migrations: ["src/migrations/*.ts"],
  subscribers: [],
});
