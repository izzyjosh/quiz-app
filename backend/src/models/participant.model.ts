import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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
  id!: string;

  @ManyToMany(() => User, (user) => user.participants)
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column()
  userId!: string;

  @ManyToOne(() => QuizSession, (quizSession) => quizSession.participants)
  @JoinColumn({ name: "quizSessionId" })
  quizSession!: QuizSession;

  @Column()
  quizSessionId!: string;

  @Column({ default: 0 })
  score!: number;

  @OneToMany(() => Submission, (submission) => submission.participant)
  submissions!: Submission[];

  @CreateDateColumn()
  createdAt!: Date;
}
