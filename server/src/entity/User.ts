import {
  Entity,
  PrimaryColumn,
  Column,
  BaseEntity,
  BeforeInsert
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

const bcrypt = require("bcryptjs");

@Entity()
export class User {
  @PrimaryColumn("uuid")
  id: string;

  @BeforeInsert()
  generateId() {
    this.id = uuidv4();
  }

  @Column({ unique: true })
  email: string;

  @Column({ type: "varchar" })
  password: string;

  @Column({ default: "user" })
  role: "user" | "admin";

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
