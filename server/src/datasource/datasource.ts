import { DataSource } from "typeorm";
import { config } from "dotenv";

config();

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  logging: process.env.DEBUG === "true",
  entities: ["src/entity/**/*.ts"],
    migrations: ["src/migrations/**/*.ts"],
  subscribers: [],
  
});

export default AppDataSource;
