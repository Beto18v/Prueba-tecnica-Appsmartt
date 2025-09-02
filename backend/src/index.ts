import 'dotenv/config';
import { AppDataSource } from './data-source';
import app from './app';

const PORT = process.env.PORT || 3000;

/**
 * Inicializa la conexión a la base de datos y el servidor
 */
const startServer = async (): Promise<void> => {
  try {
    // Inicializar conexión a la base de datos
    await AppDataSource.initialize();
    console.log('✅ Conexión a la base de datos establecida');

    // Ejecutar migraciones automáticamente
    await AppDataSource.runMigrations();
    console.log('✅ Migraciones ejecutadas correctamente');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al inicializar la aplicación:', error);
    process.exit(1);
  }
};

startServer();
