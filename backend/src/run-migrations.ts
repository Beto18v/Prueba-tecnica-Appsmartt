import 'dotenv/config';
import { AppDataSource } from './data-source';

async function runMigrations() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Conexión a la base de datos establecida');

    await AppDataSource.runMigrations();
    console.log('✅ Migraciones ejecutadas correctamente');

    await AppDataSource.destroy();
    console.log('✅ Proceso completado');
  } catch (error) {
    console.error('❌ Error ejecutando migraciones:', error);
    process.exit(1);
  }
}

runMigrations();
