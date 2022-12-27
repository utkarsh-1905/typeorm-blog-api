import { Router } from "express";

import {
  addComment,
  getCommentsByID,
  getAllComments,
  deleteCommentsByID,
  updateCommentByID,
} from "../controllers/commentsController";

const commentsRouter = Router();

//post comments
commentsRouter.post("/", addComment);

//get comments by id
commentsRouter.get("/:id", getCommentsByID);

//get all comments
commentsRouter.get("/", getAllComments);

//delete comments by id
commentsRouter.delete("/:id", deleteCommentsByID);

//update comment
commentsRouter.put("/:id", updateCommentByID);

export default commentsRouter;
