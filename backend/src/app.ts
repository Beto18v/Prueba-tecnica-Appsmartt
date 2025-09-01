import express from "express";
import { operationsRoutes } from "./modules/operations/operations.routes";
import { errorHandler } from "./middleware/errorHandler.middleware";

const app = express();

// Middleware global
app.use(express.json());

// Rutas
app.use("/api", operationsRoutes);

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

export default app;
