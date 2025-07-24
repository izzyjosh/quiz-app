import {
  Entity,
  PrimaryColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  ManyToOne
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Quiz } from "./Quiz";

@Entity()
export class Question {
  @PrimaryColumn("uuid")
  id: string;

  @BeforeInsert()
  generateId() {
    this.id = uuidv4();
  }

  @Column()
  question: string;

  @Column("text", { array: true })
  options: string[];

  @Column()
  answer: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;

  @ManyToOne(() => Quiz, quiz => quiz.questions, { onDelete: "CASCADE" })
  quiz: Quiz;
}
