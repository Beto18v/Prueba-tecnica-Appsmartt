# Prueba Técnica - Full Stack Application

Sistema completo de autenticación y gestión de operaciones desarrollado con Node.js, TypeScript,
React y PostgreSQL.

## 🏗️ Arquitectura del Sistema

```
PruebaTecnica/
├── 📁 backend/              # API REST con Node.js + TypeScript + Express + TypeORM
│   ├── src/
│   │   ├── 📁 entities/     # Entidades de base de datos (User, Operation)
│   │   ├── 📁 modules/      # Módulos de negocio (auth, operations)
│   │   ├── 📁 middleware/   # Middlewares (auth, errorHandler)
│   │   ├── 📁 migrations/   # Migraciones de base de datos
│   │   └── 📁 seeds/        # Seeds para datos iniciales
│   ├── 📁 __tests__/        # Tests de integración con Jest + Supertest
│   └── dist/                # Código compilado (generado)
├── 📁 frontend/             # Cliente React + TypeScript + Vite
│   ├── src/
│   │   ├── 📁 components/   # Componentes reutilizables (ProtectedRoute)
│   │   ├── 📁 context/      # Context API (AuthContext)
│   │   ├── 📁 pages/        # Páginas (Login, Dashboard)
│   │   ├── 📁 styles/       # Estilos SCSS
│   │   └── 📁 types/        # Tipos TypeScript
│   ├── 📁 __tests__/        # Tests con React Testing Library + Vitest
│   └── dist/                # Build de producción (generado)
├── 📁 .github/workflows/    # CI/CD con GitHub Actions
├── 📄 .eslintrc.js          # Configuración ESLint (monorepo)
├── 📄 .prettierrc           # Configuración Prettier (monorepo)
├── 📄 .gitignore            # Archivos ignorados por Git (monorepo)
├── 📄 nginx.conf            # Configuración Nginx para producción
├── 📄 ecosystem.config.js   # Configuración PM2 para despliegue
└── 📄 README-deploy.md      # Guía de despliegue en DigitalOcean
```

## 🚀 Quick Start

### Requisitos

- Node.js 18+
- npm 8+
- PostgreSQL 13+

### Instalación completa

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/PruebaTecnica.git
cd PruebaTecnica

# Instalar dependencias en ambos proyectos
npm run install:all

# Configurar variables de entorno
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Configurar base de datos y ejecutar migraciones
cd backend
npm run migrate
npm run seed

# Iniciar desarrollo (backend + frontend)
cd ..
npm run dev
```

### Acceso a la aplicación

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Usuario de prueba**: test@example.com / Password123!

---

# 📖 Documentación por Módulos

## 🔧 Backend

### Tecnologías

- **Runtime**: Node.js 18+ con TypeScript
- **Framework**: Express.js
- **ORM**: TypeORM
- **Base de datos**: PostgreSQL
- **Autenticación**: JWT (JSON Web Tokens)
- **Validación**: class-validator + class-transformer
- **Testing**: Jest + Supertest
- **Documentación**: Esta sección

### Estructura del Backend

```
backend/src/
├── 📄 app.ts              # Configuración de Express
├── 📄 data-source.ts      # Configuración TypeORM
├── 📄 index.ts            # Punto de entrada
├── 📁 entities/           # Modelos de datos
│   ├── User.ts            # Usuario con email/password
│   └── Operation.ts       # Operaciones de negocio
├── 📁 middleware/
│   ├── auth.middleware.ts      # Validación JWT
│   └── errorHandler.middleware.ts  # Manejo de errores
├── 📁 modules/
│   ├── 📁 auth/           # Módulo de autenticación
│   │   ├── auth.controller.ts  # Controlador login
│   │   ├── auth.service.ts     # Lógica de negocio
│   │   ├── auth.routes.ts      # Rutas /auth/*
│   │   └── dtos/login.dto.ts   # Validación datos login
│   └── 📁 operations/     # Módulo de operaciones
│       ├── operations.controller.ts
│       ├── operations.service.ts
│       ├── operations.repository.ts
│       ├── operations.routes.ts
│       └── dtos/create-operation.dto.ts
├── 📁 migrations/         # Migraciones DB automáticas
└── 📁 seeds/             # Datos iniciales
```

### API Endpoints

#### 🔐 Autenticación `/api/auth`

**POST `/api/auth/login`**

- **Descripción**: Autentica usuario y retorna JWT
- **Body**:
  ```json
  {
    "email": "usuario@email.com",
    "password": "contraseña"
  }
  ```
- **Respuestas**:
  - `200 OK`: Login exitoso
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "email": "usuario@email.com"
      }
    }
    ```
  - `400 Bad Request`: Datos de entrada inválidos
    ```json
    {
      "error": "Error de validación",
      "message": "El email debe tener un formato válido; La contraseña es requerida"
    }
    ```
  - `401 Unauthorized`: Credenciales incorrectas
    ```json
    {
      "message": "Credenciales inválidas"
    }
    ```

#### 📊 Operaciones `/api/operations`

**GET `/api/operations`**

- **Descripción**: Obtiene todas las operaciones del usuario autenticado
- **Headers**: `Authorization: Bearer <token>`
- **Respuesta** `200 OK`:
  ```json
  [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Operación de ejemplo",
      "description": "Descripción detallada",
      "amount": 1500.5,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "user": {
        "id": "456e7890-e89b-12d3-a456-426614174000",
        "email": "usuario@email.com"
      }
    }
  ]
  ```

**POST `/api/operations`**

- **Descripción**: Crea una nueva operación
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "title": "Nueva operación",
    "description": "Descripción opcional",
    "amount": 2500.75
  }
  ```
- **Respuestas**:
  - `201 Created`: Operación creada exitosamente
  - `400 Bad Request`: Datos inválidos
  - `401 Unauthorized`: Token inválido o expirado

**GET `/api/operations/:id`**

- **Descripción**: Obtiene una operación específica
- **Headers**: `Authorization: Bearer <token>`
- **Params**: `id` (UUID de la operación)
- **Respuestas**:
  - `200 OK`: Operación encontrada
  - `404 Not Found`: Operación no existe o no pertenece al usuario
  - `401 Unauthorized`: Token inválido

### Flujo de Autenticación Backend

1. **Registro inicial**: Se ejecuta seed con usuario de prueba
2. **Login POST /auth/login**:
   - Valida formato email/password con `class-validator`
   - Busca usuario en DB por email
   - Compara password con `bcrypt.compare()`
   - Genera JWT con `jsonwebtoken.sign()` incluyendo `userId`
   - Retorna token + datos del usuario
3. **Protección de rutas**:
   - Middleware `auth.middleware.ts` extrae token del header `Authorization: Bearer <token>`
   - Verifica y decodifica JWT con `jsonwebtoken.verify()`
   - Busca usuario en DB y lo adjunta a `req.user`
   - Si falla, retorna `401 Unauthorized`

### Configuración de entorno

```bash
# backend/.env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/database
JWT_SECRET=tu_super_secreto_jwt_key_aqui
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:5173
```

### Scripts disponibles

```bash
cd backend
npm run dev          # Desarrollo con ts-node
npm run build        # Compilar TypeScript a dist/
npm run start        # Producción desde dist/
npm run migrate      # Ejecutar migraciones
npm run seed         # Datos iniciales
npm run test         # Ejecutar tests
npm run lint         # ESLint con --fix
```

---

## 🎨 Frontend

### Tecnologías

- **Framework**: React 18 con TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Estado**: Context API + useState/useEffect
- **Estilos**: SCSS con arquitectura modular
- **Testing**: Vitest + React Testing Library
- **HTTP**: Fetch API nativo

### Estructura del Frontend

```
frontend/src/
├── 📄 App.tsx               # Configuración de rutas
├── 📄 main.tsx             # Punto de entrada React
├── 📁 components/
│   └── ProtectedRoute.tsx   # HOC para rutas autenticadas
├── 📁 context/
│   └── AuthContext.tsx      # Estado global de autenticación
├── 📁 pages/
│   ├── Login.tsx           # Página de login
│   └── Dashboard.tsx       # Página principal autenticada
├── 📁 styles/
│   ├── globals.scss        # Estilos globales
│   └── variables.scss      # Variables SCSS
├── 📁 types/
│   └── auth.types.ts       # Tipos TypeScript para auth
└── 📁 utils/
    └── validation.ts       # Utilidades de validación
```

### Flujo de Autenticación Frontend

#### 1. **AuthContext** (`src/context/AuthContext.tsx`)

Context Provider que maneja el estado global de autenticación:

```typescript
interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  loading: boolean;
}
```

**Funcionalidades**:

- **Persistencia**: Guarda token/usuario en `localStorage`
- **Inicialización**: Restaura sesión al cargar la aplicación
- **Login**: Realiza POST a `${import.meta.env.VITE_API_URL}/auth/login`
- **Logout**: Limpia estado y localStorage
- **Estado**: Computed property `isAuthenticated = Boolean(token && user)`

#### 2. **ProtectedRoute** (`src/components/ProtectedRoute.tsx`)

Higher-Order Component que protege rutas autenticadas:

```typescript
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
};
```

#### 3. **Flujo completo**:

1. Usuario visita `/dashboard`
2. `ProtectedRoute` verifica `isAuthenticated`
3. Si no está autenticado → redirect a `/login`
4. En `/login` usuario ingresa credenciales
5. `AuthContext.login()` hace POST a backend
6. Si exitoso: guarda token + user, redirect a `/dashboard`
7. Si falla: muestra error en interfaz

### Conectividad con Backend

El frontend usa la variable de entorno `VITE_API_URL` para todas las llamadas:

```typescript
// Configuración automática
const apiUrl = import.meta.env.VITE_API_URL; // http://localhost:3000/api

// Ejemplo de llamada
const response = await fetch(`${apiUrl}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(credentials),
});
```

### Configuración de entorno

```bash
# frontend/.env
VITE_API_URL=http://localhost:3000/api
VITE_APP_TITLE=Mi Aplicación
VITE_APP_VERSION=1.0.0
```

### Scripts disponibles

```bash
cd frontend
npm run dev          # Desarrollo con Vite (puerto 5173)
npm run build        # Build de producción a dist/
npm run preview      # Vista previa del build
npm run test         # Ejecutar tests con Vitest
npm run lint         # ESLint con --fix
```

### Componentes principales

**Login.tsx**:

- Formulario controlado con validación en tiempo real
- Manejo de errores del servidor (401, 400, 500)
- Loading states durante petición
- Redirect automático tras login exitoso

**Dashboard.tsx**:

- Bienvenida personalizada con email del usuario
- Botón de logout
- Base para futuras funcionalidades

---

## 🚀 DevOps

### Configuración de Despliegue

#### PM2 Configuration (`ecosystem.config.js`)

```javascript
module.exports = {
  apps: [
    {
      name: 'backend-app',
      script: 'dist/index.js',
      cwd: '/var/www/app/backend',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      // Configuración de producción
      instances: 'max', // Usar todos los cores
      exec_mode: 'cluster', // Modo cluster
      autorestart: true, // Reinicio automático
      watch: false, // No watch en producción
      max_memory_restart: '1G', // Reiniciar si supera 1GB
      // Logs
      log_file: '/var/log/pm2/backend-app.log',
      out_file: '/var/log/pm2/backend-app-out.log',
      error_file: '/var/log/pm2/backend-app-error.log',
      time: true,
    },
  ],
};
```

#### Nginx Configuration (`nginx.conf`)

Configuración para servir frontend estático y proxy del backend:

```nginx
server {
    listen 443 ssl http2;
    server_name tudominio.com;

    # Frontend - Archivos estáticos
    location / {
        root /var/www/app/dist;
        index index.html;
        try_files $uri $uri/ /index.html;  # SPA fallback
    }

    # Backend API - Proxy a Node.js
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Caché para assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Despliegue en DigitalOcean

**Arquitectura de producción**:

```
Internet → Nginx (Puerto 80/443) → Frontend (Archivos estáticos)
                ↓
              /api/* → Node.js + PM2 (Puerto 3000) → PostgreSQL
```

**Stack de producción**:

- **SO**: Ubuntu 22.04 LTS
- **Web Server**: Nginx (reverse proxy + static files)
- **Process Manager**: PM2 (clustering + auto-restart)
- **Database**: PostgreSQL
- **SSL**: Let's Encrypt (Certbot)

**Proceso de despliegue**:

1. **Setup servidor**: Nginx + Node.js + PostgreSQL + PM2
2. **Base de datos**: Crear DB, ejecutar migraciones y seeds
3. **Backend**: Copiar código, instalar deps, compilar, iniciar con PM2
4. **Frontend**: Build local, copiar `dist/` a `/var/www/app/dist/`
5. **Nginx**: Configurar virtual host, SSL, restart
6. **Firewall**: UFW para abrir solo puertos 22, 80, 443

Ver **README-deploy.md** para guía paso a paso completa.

---

## 🧪 QA & CI

### Estrategia de Testing

#### Backend Testing (Jest + Supertest)

**Ubicación**: `backend/__tests__/`

**Tests de integración**:

- **auth.integration.test.ts**: Testing completo del módulo de autenticación
  - Login exitoso con credenciales válidas
  - Error 401 con credenciales incorrectas
  - Error 400 con datos de entrada inválidos
  - Validación de JWT retornado
- **operations.integration.test.ts**: Testing del módulo de operaciones
  - CRUD completo con autenticación
  - Verificación de permisos (solo operaciones del usuario)
  - Validación de datos de entrada

**Configuración** (`jest.config.js`):

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/__tests__'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
};
```

#### Frontend Testing (Vitest + React Testing Library)

**Ubicación**: `frontend/__tests__/`

**Tests de componentes**:

- **Login.test.tsx**: Testing completo del formulario de login
  - Renderizado correcto de elementos
  - Validación de campos vacíos
  - Validación de formato de email
  - Manejo de respuesta exitosa del servidor
  - Manejo de errores 401 y 500
  - Integración con AuthContext

**Configuración** (`vite.config.ts`):

```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

### CI/CD Pipeline

#### GitHub Actions (`.github/workflows/ci.yml`)

**Trigger**: Push/PR hacia `main`

**Jobs paralelos**:

1. **Backend Job**:

   ```yaml
   - Setup Node.js 18
   - Cache npm dependencies
   - npm ci (install exact versions)
   - npm run lint (ESLint)
   - npm run test (Jest con DB test)
   - npm run build (TypeScript compilation)
   - Upload artifacts
   ```

2. **Frontend Job**:

   ```yaml
   - Setup Node.js 18
   - Cache npm dependencies
   - npm ci
   - npm run lint (ESLint + React rules)
   - npm run test (Vitest)
   - npm run build (Vite build)
   - Upload artifacts
   ```

3. **Quality Gates**:
   - Espera ambos jobs
   - Falla si cualquier job anterior falló
   - Success solo si todos pasan

**Variables de entorno en CI**:

```yaml
# Backend testing
NODE_ENV: test
DB_HOST: localhost
DB_PORT: 5432
DB_USERNAME: postgres
DB_PASSWORD: postgres
DB_NAME: test_db
JWT_SECRET: test_secret_key

# Frontend testing
VITE_API_URL: http://localhost:3000
```

### Ejecutar Testing Localmente

#### Tests del Backend

```bash
cd backend

# Tests completos
npm run test

# Tests con coverage
npm run test -- --coverage

# Tests específicos
npm run test auth.integration.test.ts

# Tests en modo watch
npm run test -- --watch
```

#### Tests del Frontend

```bash
cd frontend

# Tests completos
npm run test

# Tests en modo watch
npm run test:ui

# Tests de un archivo específico
npm run test Login.test.tsx
```

#### CI completo local

```bash
# Desde la raíz del proyecto
npm run ci                    # lint + test + build (ambos)

# O paso a paso
npm run lint                  # ESLint backend + frontend
npm run test                  # Jest + Vitest
npm run build                 # TypeScript + Vite
```

### Interpretación de Resultados

**✅ Success indicators**:

- Tests: `✓ All tests passed`
- Lint: `✓ No ESLint errors`
- Build: `✓ Compilation successful`
- CI: `✓ All quality gates passed`

**❌ Failure indicators**:

- Tests: Detalles de assertions fallidas
- Lint: Lista de errores de código y formato
- Build: Errores de TypeScript compilation
- CI: Job específico que falló + logs

**📊 Coverage reports**:

- Backend: Jest genera reporte HTML en `coverage/`
- Métricas: Lines, Functions, Branches, Statements
- Target: >80% coverage para componentes críticos

---

## 📚 Scripts del Monorepo

### Scripts principales (desde raíz)

```bash
# Desarrollo
npm run dev                   # Backend + Frontend en paralelo
npm run install:all          # Instalar deps en ambos proyectos

# Quality Assurance
npm run ci                    # Pipeline completo: lint + test + build
npm run lint                  # ESLint en backend y frontend
npm run test                  # Jest + Vitest
npm run build                # Compilar ambos proyectos

# Utilidades
npm run clean                 # Limpiar builds y caches
npm run format               # Prettier en todo el monorepo
```

### Scripts específicos

```bash
# Backend específico
npm run lint:backend
npm run test:backend
npm run build:backend

# Frontend específico
npm run lint:frontend
npm run test:frontend
npm run build:frontend
```

## 🔧 Troubleshooting

### Problemas comunes

**Error: Cannot connect to database**

```bash
# Verificar PostgreSQL
sudo systemctl status postgresql
sudo systemctl start postgresql

# Verificar variables de entorno
cat backend/.env
```

**Error: ECONNREFUSED al hacer login**

```bash
# Verificar que backend esté corriendo
cd backend && npm run dev

# Verificar URL en frontend
cat frontend/.env  # VITE_API_URL=http://localhost:3000/api
```

**Tests fallando**

```bash
# Limpiar y reinstalar
rm -rf node_modules package-lock.json
npm install

# Variables de entorno para tests
cp backend/.env.test backend/.env
```

**Build de producción**

```bash
# Verificar variables de entorno de producción
cat frontend/.env  # VITE_API_URL=https://tudominio.com/api
cat backend/.env   # NODE_ENV=production
```

## 📄 Licencia

MIT License - Ver archivo LICENSE para detalles.
