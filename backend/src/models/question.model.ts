import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Quiz } from "./quiz.model";
import { Option } from "./option.model";

@Entity("questions")
export class Question {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  text!: string;

  @Column()
  order!: number;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions, { onDelete: "CASCADE" })
  @JoinColumn({ name: "quizId" })
  quiz!: Quiz;

  @Column()
  quizId!: string;

  @OneToMany(() => Option, (option) => option.question)
  options!: Option[];
}
