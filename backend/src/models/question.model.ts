import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Quiz } from "./quiz.model";
import { Option } from "./option.model";

@Entity("questions")
export class Question {
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @Column()
  text!: string;

  @Column()
  order!: number;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions, { onDelete: "CASCADE" })
  quiz!: Quiz;

  @OneToMany(() => Option, (option) => option.question)
  options!: Option[];
}
