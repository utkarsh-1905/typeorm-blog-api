import "reflect-metadata";
import express from "express";

import { dataSource } from "./data-source";
import authRouter from "./routes/authRoutes";
import blogRouter from "./routes/blogRoutes";
import commentsRouter from "./routes/commentRoutes";

import { likeBlog, dislikeBlog } from "./controllers/likeController";

const PORT: number = 4000;

const app = express();

dataSource
  .initialize()
  .then(() => {
    console.log("Database connection established");
  })
  .catch((e) => {
    console.log("Connection error", e);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", authRouter);
app.use("/api/posts", blogRouter);
app.use("/api/comments", commentsRouter);

app.post("/api/like", likeBlog);
app.post("/api/dislike", dislikeBlog);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
