/**
 * Utilidades para validación de formularios
 */

// Interfaz para errores de validación
export interface ValidationErrors {
  [key: string]: string;
}

/**
 * Valida un email usando expresión regular
 * @param email - Email a validar
 * @returns true si el email es válido, false en caso contrario
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Valida que una contraseña no esté vacía
 * @param password - Contraseña a validar
 * @returns true si la contraseña es válida, false en caso contrario
 */
export const isValidPassword = (password: string): boolean => {
  return password.trim().length > 0;
};

/**
 * Valida las credenciales de login
 * @param email - Email del usuario
 * @param password - Contraseña del usuario
 * @returns Objeto con errores de validación (vacío si no hay errores)
 */
export const validateLoginCredentials = (
  email: string,
  password: string
): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Validar email
  if (!email.trim()) {
    errors.email = 'El email es requerido';
  } else if (!isValidEmail(email)) {
    errors.email = 'El formato del email no es válido';
  }

  // Validar contraseña
  if (!password.trim()) {
    errors.password = 'La contraseña es requerida';
  }

  return errors;
};
