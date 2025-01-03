import { DataSource } from "typeorm";
import { config } from "dotenv";
import { User } from "../entity/User";

config();

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: true,
  logging: process.env.DEBUG === "true",
  entities: [User],
  subscribers: [],
  migrations: [],
});

export default AppDataSource;