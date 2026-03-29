import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("refresh_tokens")
@Index("IDX_refresh_token_hash", ["tokenHash"], { unique: true })
@Index("IDX_refresh_user_active", ["userId", "isRevoked", "expiresAt"])
export class RefreshToken {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  tokenHash!: string;

  @Column()
  userId!: string;

  @Column({ default: false })
  isRevoked!: boolean;

  @Column()
  expiresAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}
