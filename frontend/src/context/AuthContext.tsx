import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  AuthContextType,
  LoginCredentials,
  User,
  LoginResponse,
} from '../types/auth.types';

// Crear el contexto de autenticación
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Clave para almacenar el token en localStorage
const TOKEN_STORAGE_KEY = 'auth_token';
const USER_STORAGE_KEY = 'auth_user';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Proveedor del contexto de autenticación
 * Maneja el estado global de autenticación de la aplicación
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Computed property para verificar si el usuario está autenticado
  const isAuthenticated = Boolean(token && user);

  /**
   * Inicializa el estado de autenticación desde localStorage
   */
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);

        if (
          storedToken &&
          storedUser &&
          storedUser !== 'undefined' &&
          storedUser !== 'null'
        ) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error al cargar datos de autenticación:', error);
        // Limpiar datos corruptos
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Función para realizar login
   * @param credentials - Email y contraseña del usuario
   */
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;

      if (!apiUrl) {
        throw new Error('URL de la API no configurada');
      }

      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Credenciales inválidas');
        }
        throw new Error('Error en el servidor. Intenta nuevamente.');
      }

      const data: LoginResponse = await response.json();

      // Guardar token y usuario en el estado y localStorage
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
    } catch (error) {
      // Re-lanzar el error para que el componente pueda manejarlo
      throw error;
    }
  };

  /**
   * Función para cerrar sesión
   */
  const logout = (): void => {
    // Limpiar estado
    setToken(null);
    setUser(null);

    // Limpiar localStorage
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    token,
    user,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

/**
 * Hook personalizado para usar el contexto de autenticación
 * @returns Contexto de autenticación
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }

  return context;
};
