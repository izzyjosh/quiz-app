import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.model";
import { QuizSession } from "./quizsession.model";
import { Submission } from "./submission.model";

@Entity("participants")
export class Participant {
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @ManyToMany(() => User, (user) => user.participants)
  user!: User;

  @ManyToOne(() => QuizSession, (quizSession) => quizSession.participants)
  quizSession!: QuizSession;

  @Column({ default: 0 })
  score!: number;

  @OneToMany(() => Submission, (submission) => submission.participant)
  submissions!: Submission[];

  @CreateDateColumn()
  createdAt!: Date;
}
