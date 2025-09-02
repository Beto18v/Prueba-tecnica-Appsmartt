import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import Login from "../src/pages/Login";
import { AuthProvider } from "../src/context/AuthContext";

// Mock del fetch global
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock de las variables de entorno
vi.mock("import.meta", () => ({
  env: {
    VITE_API_URL: "http://localhost:3000",
  },
}));

// Componente wrapper para las pruebas
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>{children}</AuthProvider>
  </BrowserRouter>
);

describe("Login Component", () => {
  beforeEach(() => {
    // Limpiar mocks antes de cada test
    mockFetch.mockClear();
    // Limpiar localStorage
    localStorage.clear();
  });

  it("renderiza el formulario de login correctamente", () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    // Verificar que los elementos del formulario están presentes
    expect(
      screen.getByRole("heading", { name: /iniciar sesión/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /iniciar sesión/i })
    ).toBeInTheDocument();
  });

  it("muestra errores de validación para campos vacíos", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    const submitButton = screen.getByRole("button", {
      name: /iniciar sesión/i,
    });

    // Intentar enviar formulario sin llenar campos
    await user.click(submitButton);

    // Verificar que se muestran errores de validación
    expect(screen.getByText(/el email es requerido/i)).toBeInTheDocument();
    expect(screen.getByText(/la contraseña es requerida/i)).toBeInTheDocument();
  });

  it("muestra error de formato para email inválido", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole("button", {
      name: /iniciar sesión/i,
    });

    // Llenar campos con email inválido
    await user.type(emailInput, "email-invalido");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    // Verificar error de formato de email
    expect(
      screen.getByText(/el formato del email no es válido/i)
    ).toBeInTheDocument();
  });

  it("realiza login exitoso y maneja la respuesta", async () => {
    const user = userEvent.setup();

    // Mock de respuesta exitosa
    const mockResponse = {
      token: "fake-jwt-token",
      user: {
        id: 1,
        email: "test@example.com",
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole("button", {
      name: /iniciar sesión/i,
    });

    // Llenar y enviar formulario
    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    // Verificar que se hace la petición correcta
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3000/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "test@example.com",
            password: "password123",
          }),
        }
      );
    });

    // Verificar que los datos se guardan en localStorage
    expect(localStorage.getItem("auth_token")).toBe("fake-jwt-token");
    expect(JSON.parse(localStorage.getItem("auth_user")!)).toEqual(
      mockResponse.user
    );
  });

  it('muestra "Credenciales inválidas" en caso de error 401', async () => {
    const user = userEvent.setup();

    // Mock de respuesta con error 401
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole("button", {
      name: /iniciar sesión/i,
    });

    // Llenar y enviar formulario
    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "wrongpassword");
    await user.click(submitButton);

    // Verificar que se muestra el mensaje de credenciales inválidas
    await waitFor(() => {
      expect(screen.getByText("Credenciales inválidas")).toBeInTheDocument();
    });
  });

  it("muestra mensaje de error del servidor para otros errores", async () => {
    const user = userEvent.setup();

    // Mock de respuesta con error 500
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole("button", {
      name: /iniciar sesión/i,
    });

    // Llenar y enviar formulario
    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    // Verificar que se muestra mensaje de error del servidor
    await waitFor(() => {
      expect(screen.getByText(/error en el servidor/i)).toBeInTheDocument();
    });
  });

  it("limpia errores de validación cuando el usuario empieza a escribir", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", {
      name: /iniciar sesión/i,
    });

    // Generar error de validación
    await user.click(submitButton);
    expect(screen.getByText(/el email es requerido/i)).toBeInTheDocument();

    // Empezar a escribir en el campo
    await user.type(emailInput, "t");

    // Verificar que el error se limpia
    expect(
      screen.queryByText(/el email es requerido/i)
    ).not.toBeInTheDocument();
  });
});
