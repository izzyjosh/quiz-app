import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.model";
import { Question } from "./question.model";

@Entity("quizzes")
export class Quiz {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ default: 10 })
  timeLimit!: number; // in seconds per questions

  @ManyToOne(() => User, (user) => user.quizzes)
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column()
  userId!: string;

  @OneToMany(() => Question, (question) => question.quiz)
  questions!: Question[];

  @CreateDateColumn()
  createdAt!: Date;

  @CreateDateColumn()
  updatedAt!: Date;
}
