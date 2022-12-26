import "reflect-metadata";
import express from 'express';

import {dataSource} from "./data-source"

const PORT: number = 4000;

const app = express();

dataSource.initialize().then(()=>{
    console.log("Database connection established")
}).catch(e=>{
    console.log("Connection error",e)
})

app.listen(PORT,()=>{
    console.log(`Server is running on port http://localhost:${PORT}`)
})