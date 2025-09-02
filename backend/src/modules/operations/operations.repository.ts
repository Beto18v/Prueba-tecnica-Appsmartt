import { Repository } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { Operation } from '../../entities/Operation';
import { CreateOperationRequest } from '../../types';

export class OperationsRepository {
  private repository: Repository<Operation>;

  constructor() {
    this.repository = AppDataSource.getRepository(Operation);
  }

  /**
   * Crea una nueva operación en la base de datos usando transacción
   */
  async create(
    operationData: CreateOperationRequest,
    userId: string
  ): Promise<Operation> {
    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const operation = queryRunner.manager.create(Operation, {
        ...operationData,
        userId,
      });

      const savedOperation = await queryRunner.manager.save(operation);

      await queryRunner.commitTransaction();
      return savedOperation;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Busca una operación por ID
   */
  async findById(id: string): Promise<Operation | null> {
    return this.repository.findOne({ where: { id } });
  }

  /**
   * Busca operaciones por usuario
   */
  async findByUserId(userId: string): Promise<Operation[]> {
    return this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}
