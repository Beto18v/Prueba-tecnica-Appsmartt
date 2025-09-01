import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";
import { OperationType } from "../types";

@Entity("operations")
export class Operation {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: "enum",
    enum: ["buy", "sell"],
  })
  type!: OperationType;

  @Column("decimal", { precision: 10, scale: 2 })
  amount!: number;

  @Column({ length: 3 })
  currency!: string;

  @Column("uuid")
  userId!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
