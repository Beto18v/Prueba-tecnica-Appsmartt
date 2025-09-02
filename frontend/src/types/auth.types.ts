/**
 * Tipos relacionados con la autenticación
 */

// Interfaz para las credenciales de login
export interface LoginCredentials {
  email: string;
  password: string;
}

// Interfaz para los datos del usuario
export interface User {
  id: string; // UUID
  email: string;
  // Agregar más campos según la respuesta del backend
}

// Interfaz para la respuesta del login exitoso
export interface LoginResponse {
  token: string;
  user: User;
}

// Interfaz para el contexto de autenticación
export interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

// Tipos para errores de autenticación
export interface AuthError {
  message: string;
  status?: number;
}
