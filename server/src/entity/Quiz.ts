import {
  Entity,
  PrimaryColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  MayToOne,
  BeforeInsert
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Question } from "./Question";
import { Category } from "./Category";

@Entity()
export class Quiz {
  @PrimaryColumn("uuid")
  id: string;

  @BeforeInsert()
  generateId() {
    this.id = uuidv4;
  }

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  numberOfQuestions: number;

  @Column()
  timelimit: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;

  @OneToMany(() => Question, question => question.quiz, { cascade: true })
  questions: Question[];

  @ManyToOne(() => Category, category => category.quizzes, {
    onDelete: "CASCADE"
  })
  category: Category;
}
