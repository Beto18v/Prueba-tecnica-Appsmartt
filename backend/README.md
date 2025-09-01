# Backend Prueba Técnica - Node.js TypeScript

Backend para gestión de operaciones financieras desarrollado con Node.js, TypeScript, Express, TypeORM y PostgreSQL.

## Características

- ✅ API REST con endpoint POST /api/operations
- ✅ API de autenticación con endpoint POST /api/auth/login
- ✅ Autenticación JWT con middleware
- ✅ Hash de contraseñas con bcrypt
- ✅ Validación de datos con class-validator
- ✅ Transacciones de base de datos con TypeORM
- ✅ Manejo centralizado de errores
- ✅ Tests de integración con Jest y Supertest
- ✅ Migraciones de base de datos y seeds
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

5. **Crear usuario de prueba:**

```bash
npm run seed
```

## Scripts disponibles

- `npm run dev` - Desarrollo con hot reload
- `npm run build` - Compilar TypeScript
- `npm run start` - Ejecutar versión compilada
- `npm run migrate` - Ejecutar migraciones
- `npm run seed` - Crear usuario de prueba
- `npm run test` - Ejecutar tests

## Uso de la API

### Autenticación

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Password123!"
}
```

**Respuesta exitosa (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error de credenciales (401):**

```json
{
  "message": "Credenciales inválidas"
}
```

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
│   ├── Operation.ts      # Entidad de operaciones
│   └── User.ts           # Entidad de usuarios
├── migrations/           # Migraciones TypeORM
├── middleware/           # Middlewares (auth, errores)
├── modules/
│   ├── operations/       # Módulo de operaciones
│   │   ├── operations.controller.ts
│   │   ├── operations.service.ts
│   │   ├── operations.repository.ts
│   │   ├── operations.routes.ts
│   │   └── dtos/
│   └── auth/             # Módulo de autenticación
│       ├── auth.controller.ts
│       ├── auth.service.ts
│       ├── auth.routes.ts
│       └── dtos/
├── seeds/                # Seeds de base de datos
│   └── user.seed.ts      # Seed del usuario de prueba
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

- **Autenticación:**
  - Login exitoso con credenciales válidas
  - Error 401 con credenciales inválidas
  - Validación de campos de entrada
- **Operaciones:**
  - Creación exitosa de operaciones
  - Validaciones de entrada
  - Autenticación JWT
  - Manejo de errores

## Usuario de prueba

Después de ejecutar `npm run seed`, estará disponible:

- **Email:** `test@example.com`
- **Password:** `Password123!`

## Variables de entorno requeridas

```env
# Base de datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=prueba_tecnica

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# Servidor
PORT=3000
NODE_ENV=development
```
