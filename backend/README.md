# Backend Prueba Técnica - Node.js TypeScript

Backend para gestión de operaciones financieras desarrollado con Node.js, TypeScript, Express, TypeORM y PostgreSQL.

## Características

- ✅ API REST con endpoint POST /api/operations
- ✅ Autenticación JWT con middleware
- ✅ Validación de datos con class-validator
- ✅ Transacciones de base de datos con TypeORM
- ✅ Manejo centralizado de errores
- ✅ Tests de integración con Jest y Supertest
- ✅ Migraciones de base de datos
- ✅ TypeScript estricto

## Instalación

1. **Clonar e instalar dependencias:**

```bash
cd backend
npm install
```

2. **Configurar variables de entorno:**

```bash
cp .env.example .env
# Editar .env con tus datos de PostgreSQL
```

3. **Configurar base de datos PostgreSQL:**

- Crear base de datos `prueba_tecnica`
- Actualizar credenciales en `.env`

4. **Ejecutar migraciones:**

```bash
npm run migrate
```

## Scripts disponibles

- `npm run dev` - Desarrollo con hot reload
- `npm run build` - Compilar TypeScript
- `npm run start` - Ejecutar versión compilada
- `npm run migrate` - Ejecutar migraciones
- `npm run test` - Ejecutar tests

## Uso de la API

### Crear operación

```bash
POST /api/operations
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "type": "buy", // "buy" | "sell"
  "amount": 100.50, // número > 0
  "currency": "USD" // código ISO de 3 letras
}
```

**Respuesta exitosa (201):**

```json
{
  "id": "uuid",
  "type": "buy",
  "amount": 100.5,
  "currency": "USD",
  "createdAt": "2023-09-01T10:00:00.000Z"
}
```

## Estructura del proyecto

```
src/
├── index.ts              # Punto de entrada
├── app.ts                # Configuración Express
├── data-source.ts        # Configuración TypeORM
├── entities/             # Entidades de base de datos
├── migrations/           # Migraciones TypeORM
├── middleware/           # Middlewares (auth, errores)
├── modules/operations/   # Módulo de operaciones
│   ├── operations.controller.ts
│   ├── operations.service.ts
│   ├── operations.repository.ts
│   ├── operations.routes.ts
│   └── dtos/
└── types/               # Tipos TypeScript
```

## Arquitectura

- **Controller**: Maneja requests HTTP y validaciones
- **Service**: Lógica de negocio
- **Repository**: Acceso a datos con transacciones
- **Middleware**: Autenticación JWT y manejo de errores
- **DTOs**: Validación de entrada con class-validator

## Testing

```bash
npm run test
```

Los tests cubren:

- Creación exitosa de operaciones
- Validaciones de entrada
- Autenticación JWT
- Manejo de errores
