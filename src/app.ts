import "reflect-metadata";
import express from 'express';

import {dataSource} from "./data-source"
import authRouter from "./routes/authRoutes";
import blogRouter from "./routes/blogRoutes";

const PORT: number = 4000;

const app = express();

dataSource.initialize().then(()=>{
    console.log("Database connection established")
}).catch(e=>{
    console.log("Connection error",e)
})

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/api",authRouter);
app.use("/api/posts",blogRouter);

app.listen(PORT,()=>{
    console.log(`Server is running on port http://localhost:${PORT}`)
})