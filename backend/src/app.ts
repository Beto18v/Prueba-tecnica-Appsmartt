import express from 'express';
import cors from 'cors';
import { operationsRoutes } from './modules/operations/operations.routes';
import { authRoutes } from './modules/auth/auth.routes';
import { errorHandler } from './middleware/errorHandler.middleware';

const app = express();

// Configuración CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Middleware global
app.use(express.json());

// Rutas
app.use('/api', operationsRoutes);
app.use('/api/auth', authRoutes);

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

export default app;
