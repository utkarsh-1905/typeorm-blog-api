import { DataSource } from "typeorm";

export const dataSource = new DataSource({
    type:"postgres",
    host:"localhost",
    port:5432,
    username: "postgres",
    password: "admin",
    database: "postgres",
    entities: [],
    synchronize: true,
    logging: true
});