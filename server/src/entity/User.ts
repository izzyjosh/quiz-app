import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  BeforeInsert
} from "typeorm";

const bcrypt = require("bcryptjs");

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  email: string;

  @Column({ type: "varchar" })
  password: string;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
