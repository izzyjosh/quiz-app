import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
} from "typeorm";
import { Quiz } from "./quiz.model";
import { Participant } from "./participant.model";

@Entity("quiz sessions")
export class QuizSession {
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @ManyToOne(() => Quiz)
  quiz!: Quiz;

  @Column({ default: "waiting" })
  status!: "waiting" | "started" | "finished";

  @Column({ default: 0 })
  currentQuestionIndex!: number;

  @Column({ type: "timestamp", nullable: true })
  startTime!: Date;

  @OneToMany(() => Participant, (p) => p.quizSession)
  participants!: Participant[];

  @CreateDateColumn()
  createdAt!: Date;
}
