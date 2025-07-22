import {
  Entity,
  PrimaryColumn,
  Column,
  BaseEntity,
  BeforeInsert,
  OneToMany
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Quiz } from "./Quiz";

@Entity()
export class Category {
  @PrimaryColumn("uuid")
  id: string;

  @BeforeInsert()
  generateId() {
    this.id = uuidv4();
  }

  @Column()
  name: string;

  @Column()
  description: string;
  
  @OneToMany(() => Quiz, quiz => quiz.category, {cascade: true})
  quizzes: Quiz[]
}
