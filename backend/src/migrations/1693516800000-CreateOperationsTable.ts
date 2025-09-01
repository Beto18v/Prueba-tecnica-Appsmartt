import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateOperationsTable1693516800000 implements MigrationInterface {
  name = "CreateOperationsTable1693516800000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "operations",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "type",
            type: "enum",
            enum: ["buy", "sell"],
          },
          {
            name: "amount",
            type: "decimal",
            precision: 10,
            scale: 2,
          },
          {
            name: "currency",
            type: "varchar",
            length: "3",
          },
          {
            name: "userId",
            type: "uuid",
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true
    );

    // Crear extensión uuid-ossp si no existe
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("operations");
  }
}
