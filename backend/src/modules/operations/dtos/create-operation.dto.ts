import { IsEnum, IsNumber, IsString, Length, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { OperationType } from '../../../types';

export class CreateOperationDto {
  @IsEnum(['buy', 'sell'], {
    message: 'El tipo debe ser "buy" o "sell"',
  })
  type!: OperationType;

  @IsNumber(
    {},
    {
      message: 'El monto debe ser un número válido',
    }
  )
  @Min(0.01, {
    message: 'El monto debe ser mayor a 0',
  })
  @Transform(({ value }: { value: any }) => parseFloat(value))
  amount!: number;

  @IsString({
    message: 'La moneda debe ser una cadena de texto',
  })
  @Length(3, 3, {
    message: 'La moneda debe tener exactamente 3 caracteres (código ISO)',
  })
  @Transform(({ value }: { value: any }) => value?.toUpperCase())
  currency!: string;
}
