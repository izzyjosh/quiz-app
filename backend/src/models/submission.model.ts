import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Index,
  Unique,
} from "typeorm";
import { Participant } from "./participant.model";
import { Question } from "./question.model";
import { Option } from "./option.model";

@Entity("submissions")
@Unique(["participant", "question"])
export class Submission {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Participant, (p) => p.submissions, {
    onDelete: "CASCADE",
  })
  @Index()
  participant!: Participant;

  @ManyToOne(() => Question)
  question!: Question;

  @ManyToOne(() => Option, { nullable: true })
  selectedAnswer!: Option;

  @Column({ default: false })
  isCorrect!: boolean;

  @Column({ default: 0 })
  pointsEarned!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
