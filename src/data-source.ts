import { DataSource } from "typeorm";
import { Users } from "./entities/Users";
import { Blogs } from "./entities/Blogs";
import { Comments } from "./entities/Comments";
import { Profile } from "./entities/Profile";
import { Auth } from "./entities/Auth";

if (process.env.NODE_ENV === "production") {
  require("dotenv").config();
}

export const dataSource = new DataSource({
  type: "postgres",
  host: process.env.HOST,
  port: parseInt(process.env.PORT!),
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  entities: [Users, Blogs, Comments, Profile, Auth],
  synchronize: true,
  logging: ["error", "migration"],
});
