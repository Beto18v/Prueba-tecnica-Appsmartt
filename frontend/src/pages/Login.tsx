import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { validateLoginCredentials } from "../utils/validation";
import type { ValidationErrors } from "../utils/validation";

/**
 * Página de inicio de sesión
 * Contiene formulario con validaciones y manejo de errores
 */
const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuth();

  // Estados para el formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Si ya está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Limpiar errores previos
    setErrors({});
    setServerError("");

    // Validar campos antes de enviar
    const validationErrors = validateLoginCredentials(email, password);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Intentar hacer login
    setIsLoading(true);

    try {
      await login({ email, password });
      // Si llegamos aquí, el login fue exitoso
      // La redirección se maneja automáticamente por el ProtectedRoute
    } catch (error) {
      // Manejar errores del servidor
      if (error instanceof Error) {
        setServerError(error.message);
      } else {
        setServerError("Error desconocido. Intenta nuevamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Maneja cambios en el campo email
   */
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Limpiar error del campo cuando el usuario comienza a escribir
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  /**
   * Maneja cambios en el campo password
   */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    // Limpiar error del campo cuando el usuario comienza a escribir
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <div className="logo">🔐</div>
          <h1>Iniciar Sesión</h1>
          <p>Accede a tu cuenta para continuar</p>
        </div>

        {/* Mostrar error del servidor */}
        {serverError && <div className="alert alert-error">{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {/* Campo Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              className={errors.email ? "error" : ""}
              placeholder="tu@email.com"
              disabled={isLoading}
              autoComplete="email"
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <span id="email-error" className="error-message">
                {errors.email}
              </span>
            )}
          </div>

          {/* Campo Password */}
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className={errors.password ? "error" : ""}
              placeholder="Tu contraseña"
              disabled={isLoading}
              autoComplete="current-password"
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            {errors.password && (
              <span id="password-error" className="error-message">
                {errors.password}
              </span>
            )}
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
