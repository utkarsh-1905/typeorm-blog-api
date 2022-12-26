import {Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, Generated} from "typeorm"
import { Blogs } from "./Blogs";
import { Comments } from "./Comments";
import { Profile } from "./Profile";

@Entity()
export class Users{

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        unique: true
    })
    username: string

    @Column()
    password: string

    @OneToOne(()=>Profile,{cascade: true})
    @JoinColumn()
    profile: Profile

    @OneToMany(()=>Blogs, blog=>blog.id, {cascade: true, nullable: true})
    @JoinColumn()
    blogs: Blogs[]

    @OneToMany(()=>Comments, comment=>comment.id, {cascade: true, nullable: true})
    @JoinColumn()
    comments: Comments[]

    @Column()
    @Generated("uuid")
    token: string

}