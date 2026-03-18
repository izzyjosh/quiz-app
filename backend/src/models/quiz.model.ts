import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.model";
import { Question } from "./question.model";

@Entity("quizzes")
export class Quiz {
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ default: 10 })
  timeLimit!: number; // in seconds

  @ManyToOne(() => User, (user) => user.quizzes)
  user!: User;

  @OneToMany(() => Question, (question) => question.quiz)
  questions!: Question[];

  @CreateDateColumn()
  createdAt!: Date;

  @CreateDateColumn()
  updatedAt!: Date;
}
