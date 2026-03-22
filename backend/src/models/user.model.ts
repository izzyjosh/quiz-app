import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Quiz } from "./quiz.model";
import { Participant } from "./participant.model";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  avatar!: string;

  @Column()
  password!: string;

  @Column({ unique: true })
  username!: string;

  @OneToMany(() => Quiz, (quiz) => quiz.user)
  quizzes!: Quiz[];

  @OneToMany(() => Participant, (participant) => participant.user)
  participants!: Participant[];

  @CreateDateColumn()
  createdAt!: Date;

  @CreateDateColumn()
  updatedAt!: Date;
}
