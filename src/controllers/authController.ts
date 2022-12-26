import { Request, Response } from "express";
import { dataSource } from "../data-source";
import { Users } from "../entities/Users";
import { Profile } from "../entities/Profile";
import bcrypt from "bcrypt"

async function getUserProfileByID(req: Request, res: Response) {
    try{
        const user = await dataSource.getRepository(Users).findOne({
            relations:{
                profile: true
            },
            where:{
                id: parseInt(req.params.id)
            }
        })
        if(user){
            res.status(200).json(user.profile)
        }else{
            res.status(404).json({message: "User not found"})
        }
    } catch(e){
        res.status(500).json({message: "Server error", error: e})
    }
}

async function signup(req: Request, res: Response) {
    try{
        if(!req.body.username || !req.body.password || !req.body.first_name || !req.body.last_name || !req.body.email || !req.body.phone_number){
            res.status(400).json({message: "All fields are required"})
        }
        let profile: Profile = new Profile()
        profile.first_name = req.body.first_name
        profile.last_name = req.body.last_name
        profile.email = req.body.email
        profile.phone_number = req.body.phone_number

        let user: Users = new Users();
        user.username = req.body.username
        user.profile = profile;

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);

        const userSaved: Users = await dataSource.getRepository(Users).save(user)

        res.status(201).json({
            id: userSaved.id,
            username: userSaved.username,
            profile: userSaved.profile,
            comments: userSaved.comments,
            blogs: userSaved.blogs,
            token: userSaved.token
        })
    } catch(e){
        res.status(500).json({message: "Server error", error: e})
    }
}

async function login(req: Request, res: Response) {
    try{
        if(!req.body.username || !req.body.password){
            res.status(400).json({message: "Username and password are required"})
        }
        const user = await dataSource.getRepository(Users).findOne({
            where:{
                username: req.body.username
            },
            relations:{
                profile: true,
                comments: true,
                blogs: true
            }
        })
        if(user){
            const validPassword = await bcrypt.compare(req.body.password, user.password)
            if(validPassword){
                res.status(200).json({
                    id: user.id,
                    username: user.username,
                    profile: user.profile,
                    comments: user.comments,
                    blogs: user.blogs,
                    token: user.token
                })
            }else{
                res.status(401).json({message: "Invalid password"})
            }
        }else{
            res.status(404).json({message: "User not found"})
        }
    } catch(e){
        res.status(500).json({message: "Server error", error: e})
    }
}

export { getUserProfileByID,signup,login }