import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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

  @Column({ nullable: true })
  sessionName!: string;

  @ManyToOne(() => Quiz)
  @JoinColumn({ name: "quizId" })
  quiz!: Quiz;

  @Column()
  quizId!: string;

  @Column({ default: "waiting" })
  status!: "waiting" | "started" | "finished";

  @Column({ default: 0 })
  currentQuestionIndex!: number;

  @Column({ type: "timestamp", nullable: true })
  startTime?: Date;

  @Column({ type: "timestamp", nullable: true })
  scheduledStartTime?: Date;

  @Column({ nullable: true })
  createdByUserId!: string;

  @OneToMany(() => Participant, (p) => p.quizSession)
  participants!: Participant[];

  @CreateDateColumn()
  createdAt!: Date;
}
