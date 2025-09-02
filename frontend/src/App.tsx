import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Crear el router con la nueva API
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to='/dashboard' replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to='/dashboard' replace />,
  },
]);

/**
 * Componente principal de la aplicación
 * Configura las rutas y el contexto de autenticación
 */
function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
