import { Request, Response } from "express";
import { dataSource } from "../data-source";
import { Users } from "../entities/Users";
import { Profile } from "../entities/Profile";
import { Auth } from "../entities/Auth";
import bcrypt from "bcrypt";

async function getUserProfileByID(req: Request, res: Response) {
  try {
    const user = await dataSource.getRepository(Users).findOne({
      relations: {
        blogs: true,
        profile: true,
        comments: true,
      },
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Server error", error: e });
  }
}

async function signup(req: Request, res: Response) {
  try {
    if (
      !req.body.username ||
      !req.body.password ||
      !req.body.first_name ||
      !req.body.last_name ||
      !req.body.email ||
      !req.body.phone_number
    ) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    let profile: Profile = new Profile();
    profile.first_name = req.body.first_name;
    profile.last_name = req.body.last_name;
    profile.email = req.body.email;
    profile.phone_number = req.body.phone_number;

    let user: Users = new Users();
    user.username = req.body.username;
    user.profile = profile;

    let auth: Auth = new Auth();

    const salt = await bcrypt.genSalt(10);
    auth.password = await bcrypt.hash(req.body.password, salt);

    user.auth = auth;

    const userSaved: Users = await dataSource.getRepository(Users).save(user);

    res.status(201).json({
      id: userSaved.id,
      username: userSaved.username,
      profile: userSaved.profile,
      comments: userSaved.comments,
      blogs: userSaved.blogs,
      token: userSaved.auth.token,
    });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e });
  }
}

async function login(req: Request, res: Response) {
  try {
    if (!req.body.username || !req.body.password) {
      res.status(400).json({ message: "Username and password are required" });
      return;
    }
    const user = await dataSource.getRepository(Users).findOne({
      relations: ["auth"],
      where: {
        username: req.body.username,
      },
    });
    if (user) {
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.auth.password
      );
      if (validPassword) {
        res.status(200).json({
          id: user.id,
          username: user.username,
          profile: user.profile,
          comments: user.comments,
          blogs: user.blogs,
          token: user.auth.token,
        });
        return;
      } else {
        res.status(401).json({ message: "Invalid password" });
        return;
      }
    } else {
      res.status(404).json({ message: "User not found" });
      return;
    }
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e });
  }
}

export { getUserProfileByID, signup, login };
