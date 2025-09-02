# Frontend - Sistema de Autenticación

Frontend desarrollado con React + TypeScript + SCSS para el sistema de autenticación.

## 🚀 Tecnologías

- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **React Router DOM** - Navegación SPA
- **SCSS** - Preprocesador CSS
- **Vitest** - Framework de testing
- **React Testing Library** - Testing de componentes

## 📁 Estructura del Proyecto

```
src/
├── components/         # Componentes reutilizables
│   └── ProtectedRoute.tsx
├── context/           # Contextos de React
│   └── AuthContext.tsx
├── pages/             # Páginas principales
│   ├── Login.tsx
│   └── Dashboard.tsx
├── styles/            # Estilos globales
│   ├── globals.scss
│   └── variables.scss
├── types/             # Definiciones de tipos
│   └── auth.types.ts
├── utils/             # Utilidades
│   └── validation.ts
├── App.tsx           # Componente principal
└── main.tsx          # Punto de entrada
```

## 🛠️ Configuración e Instalación

### Prerrequisitos

- Node.js 18+
- npm o yarn

### Instalación

1. **Instalar dependencias:**

```bash
npm install
```

2. **Configurar variables de entorno:**

```bash
cp .env.example .env
```

Editar `.env` con la URL de tu API:

```
VITE_API_URL=http://localhost:3000
```

### Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Tests
npm run test

# Tests con UI
npm run test:ui

# Linting
npm run lint
```

## 🔐 Funcionalidades

### Autenticación

- **Login:** Formulario con validación de email y contraseña
- **Logout:** Cierre de sesión y limpieza de datos
- **Persistencia:** Token almacenado en localStorage
- **Protección de rutas:** Redirección automática según estado de auth

### Validaciones

- **Email:** Formato válido requerido
- **Contraseña:** Campo no vacío
- **Errores:** Mensajes específicos por campo
- **Feedback visual:** Estados de error en inputs

### Rutas

- `/login` - Página de inicio de sesión
- `/dashboard` - Dashboard protegido
- `/` - Redirección al dashboard
- `/*` - Redirección por defecto

## 🎨 Diseño

### Características del UI

- **Responsive:** Mobile-first design
- **Accesible:** Labels, ARIA attributes, navegación por teclado
- **Moderno:** Diseño limpio con sombras y animaciones
- **Consistente:** Variables CSS y sistema de diseño

### Breakpoints

```scss
$mobile: 480px;
$tablet: 768px;
$desktop: 1024px;
$large-desktop: 1200px;
```

### Colores Principales

```scss
--primary-color: #007bff;
--success-color: #28a745;
--danger-color: #dc3545;
--text-primary: #212529;
--bg-primary: #ffffff;
```

## 🧪 Testing

### Pruebas Incluidas

- **Renderizado:** Verificación de elementos UI
- **Validación:** Errores en campos vacíos/inválidos
- **Login exitoso:** Flujo completo de autenticación
- **Errores 401:** Mensaje "Credenciales inválidas"
- **Errores de servidor:** Manejo de errores generales
- **Interactividad:** Limpieza de errores al escribir

### Ejecutar Tests

```bash
# Tests en modo watch
npm run test

# Tests con interfaz visual
npm run test:ui

# Tests con coverage
npm run test -- --coverage
```

## 🔌 Integración con API

### Endpoint de Login

```typescript
POST ${VITE_API_URL}/auth/login
Content-Type: application/json

{
  "email": "usuario@email.com",
  "password": "contraseña"
}
```

### Respuesta Exitosa (200)

```typescript
{
  "token": "jwt-token-string",
  "user": {
    "id": 1,
    "email": "usuario@email.com"
  }
}
```

### Respuesta Error (401)

```typescript
// Muestra mensaje: "Credenciales inválidas"
```

## 📱 Uso

### Flujo de Autenticación

1. **Usuario visita la app** → Redirigido a `/login` si no está autenticado
2. **Completa formulario** → Validación en tiempo real
3. **Envía credenciales** → POST a `/auth/login`
4. **Login exitoso** → Token guardado, redirección a `/dashboard`
5. **Error 401** → Mensaje "Credenciales inválidas"
6. **Dashboard** → Página protegida con opción de logout

### Componentes Principales

#### AuthContext

- Maneja estado global de autenticación
- Persistencia en localStorage
- Funciones `login()` y `logout()`

#### ProtectedRoute

- HOC que protege rutas privadas
- Redirección automática al login
- Loading state durante verificación

#### Login

- Formulario con validación client-side
- Manejo de errores del servidor
- Estados de loading

#### Dashboard

- Página de bienvenida
- Información del usuario
- Botón de cierre de sesión

## 🚨 Manejo de Errores

### Validación de Formularios

```typescript
// Email inválido
"El formato del email no es válido";

// Campo vacío
"El email es requerido";
"La contraseña es requerida";
```

### Errores de API

```typescript
// 401 Unauthorized
"Credenciales inválidas";

// Otros errores
"Error en el servidor. Intenta nuevamente.";

// Sin conexión
"URL de la API no configurada";
```

## 🔧 Personalización

### Variables CSS

Editar `src/styles/variables.scss` para personalizar:

```scss
:root {
  --primary-color: #007bff; // Color principal
  --border-radius: 8px; // Radio de bordes
  --box-shadow: 0 2px 4px...; // Sombras
  --font-family: ...; // Tipografía
}
```

### Estilos de Componentes

Los estilos están organizados por módulos en `globals.scss`:

- `.form-container` - Contenedor de formularios
- `.dashboard-container` - Layout del dashboard
- `.btn` - Botones con variantes
- `.alert` - Mensajes de estado

## 📦 Build y Deployment

### Build para Producción

```bash
npm run build
```

Genera archivos optimizados en `dist/`:

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
```

### Variables de Entorno

Configurar según ambiente:

```bash
# Desarrollo
VITE_API_URL=http://localhost:3000
```
