import "dotenv/config";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import bcrypt from "bcrypt";

/**
 * Seed para crear usuario de prueba
 * Email: test@example.com
 * Password: Password123!
 */
async function seedUser(): Promise<void> {
  try {
    // Inicializar conexión a la base de datos
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const userRepository = AppDataSource.getRepository(User);

    // Verificar si el usuario ya existe
    const existingUser = await userRepository.findOne({
      where: { email: "test@example.com" },
    });

    if (existingUser) {
      console.log("✅ Usuario de prueba ya existe");
      return;
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash("Password123!", 10);

    // Crear el usuario
    const user = userRepository.create({
      email: "test@example.com",
      password: hashedPassword,
    });

    await userRepository.save(user);

    console.log("✅ Usuario de prueba creado exitosamente");
    console.log("   Email: test@example.com");
    console.log("   Password: Password123!");
  } catch (error) {
    console.error("❌ Error al crear usuario de prueba:", error);
    throw error;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

// Ejecutar seed si se llama directamente
if (require.main === module) {
  seedUser()
    .then(() => {
      console.log("🌱 Seed completado");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Error en seed:", error);
      process.exit(1);
    });
}

export { seedUser };
