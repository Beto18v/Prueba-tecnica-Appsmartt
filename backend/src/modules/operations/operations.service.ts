import { OperationsRepository } from './operations.repository';
import { CreateOperationRequest, OperationResponse } from '../../types';
import { Operation } from '../../entities/Operation';

export class OperationsService {
  private operationsRepository: OperationsRepository;

  constructor() {
    this.operationsRepository = new OperationsRepository();
  }

  /**
   * Crea una nueva operación
   * Valida los datos y delega la creación al repositorio
   */
  async createOperation(
    operationData: CreateOperationRequest,
    userId: string
  ): Promise<OperationResponse> {
    try {
      // Validaciones de negocio adicionales si es necesario
      this.validateCurrency(operationData.currency);
      this.validateAmount(operationData.amount);

      // Crear operación usando transacción
      const operation = await this.operationsRepository.create(
        operationData,
        userId
      );

      // Mapear a respuesta
      return this.mapToResponse(operation);
    } catch (error) {
      console.error('Error al crear operación:', error);
      throw error;
    }
  }

  /**
   * Valida que la moneda sea un código ISO válido
   */
  private validateCurrency(currency: string): void {
    const validCurrencies = [
      'USD',
      'EUR',
      'GBP',
      'JPY',
      'AUD',
      'CAD',
      'CHF',
      'CNY',
      'SEK',
      'NZD',
    ];

    if (!validCurrencies.includes(currency.toUpperCase())) {
      throw new Error(
        `Moneda no soportada: ${currency}. Monedas válidas: ${validCurrencies.join(
          ', '
        )}`
      );
    }
  }

  /**
   * Valida que el monto sea positivo
   */
  private validateAmount(amount: number): void {
    if (amount <= 0) {
      throw new Error('El monto debe ser mayor a 0');
    }
  }

  /**
   * Mapea entidad Operation a OperationResponse
   */
  private mapToResponse(operation: Operation): OperationResponse {
    return {
      id: operation.id,
      type: operation.type,
      amount: operation.amount,
      currency: operation.currency,
      createdAt: operation.createdAt,
    };
  }
}
