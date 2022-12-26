import { Router } from "express";
import {
  createPost,
  getBlogByID,
  updateBlogByID,
  deletePostByID,
} from "../controllers/postsController";

const blogRouter = Router();

//to create a post
blogRouter.post("/", createPost);

//get posts by id
blogRouter.get("/:id", getBlogByID);

//change posts (PUT) - can update title or content
blogRouter.put("/:id", updateBlogByID);

//delete posts (DELETE)
blogRouter.delete("/:id", deletePostByID);

export default blogRouter;
