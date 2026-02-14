import "reflect-metadata";
import { DataSource } from "typeorm";
import { MacapaContactEntity } from "./entities/contact.entity";
import { UserEntity } from "./entities/user.entity";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.MYSQL_HOST || "localhost",
  port: Number(process.env.MYSQL_PORT) || 3306,
  username: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_ROOT_PASSWORD || "root",
  database: process.env.MYSQL_DB_NAME || "macapa",
  entities: [MacapaContactEntity, UserEntity],
  synchronize: false,
  logging: false,
});

export async function connectMySQL(): Promise<DataSource> {
  const dataSource = await AppDataSource.initialize();
  console.log("✅ MySQL (macapa) conectado com sucesso");
  return dataSource;
}
