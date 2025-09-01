import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto {
  @IsEmail(
    {},
    {
      message: "El email debe tener un formato válido",
    }
  )
  email!: string;

  @IsString({
    message: "La contraseña debe ser una cadena de texto",
  })
  @MinLength(1, {
    message: "La contraseña es requerida",
  })
  password!: string;
}
