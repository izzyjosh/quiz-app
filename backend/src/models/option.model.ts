import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Question } from "./question.model";

@Entity("options")
export class Option {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  text!: string;

  @Column({ default: false })
  isCorrect!: boolean;

  @ManyToOne(() => Question, (question) => question.options, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "questionId" })
  question!: Question;

  @Column()
  questionId!: string;
}
