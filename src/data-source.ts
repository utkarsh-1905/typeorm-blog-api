import { DataSource } from "typeorm";
import { Users } from "./entities/Users";
import { Blogs } from "./entities/Blogs";
import { Comments } from "./entities/Comments";
import { Profile } from "./entities/Profile";

export const dataSource = new DataSource({
    type:"postgres",
    host:"localhost",
    port:5432,
    username: "postgres",
    password: "admin",
    database: "postgres",
    entities: [Users, Blogs, Comments, Profile],
    synchronize: true,
    logging: true
});