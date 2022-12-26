import { Router } from "express";
import {
  getUserProfileByID,
  signup,
  login,
} from "../controllers/authController";

const authRouter = Router();

//signup
authRouter.post("/signup", signup);

//login
authRouter.post("/login", login);

//returns user profile
authRouter.get("/users/:id", getUserProfileByID);

export default authRouter;
