import React from "react";
import { useAuth } from "../context/AuthContext";

/**
 * Página del dashboard principal
 * Muestra mensaje de bienvenida y permite cerrar sesión
 */
const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  /**
   * Maneja el cierre de sesión
   */
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard-container">
      {/* Header con información del usuario y botón de logout */}
      <header className="dashboard-header">
        <div className="user-info">
          <h2>¡Hola {user?.email}!</h2>
          <p>Bienvenido a tu dashboard</p>
        </div>
        <button
          onClick={handleLogout}
          className="logout-btn"
          title="Cerrar sesión"
        >
          Cerrar Sesión
        </button>
      </header>

      {/* Contenido principal */}
      <main className="dashboard-content">
        <div className="welcome-card">
          <div className="welcome-icon">👋</div>
          <h1>¡Bienvenido!</h1>
          <p>
            Has iniciado sesión correctamente. Este es tu panel de control donde
            puedes gestionar tu cuenta y acceder a todas las funcionalidades de
            la aplicación.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
