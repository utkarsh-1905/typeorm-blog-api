import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany} from "typeorm"
import { Users } from "./Users"
import { Comments } from "./Comments";

@Entity()
export class Blogs{

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column({length: 5000})
    content: string

    @Column()
    likes: number

    @Column()
    dislikes: number

    @Column({type:"timestamp"})
    created_at: Date

    @ManyToOne(()=>Users, user=>user.blogs)
    @JoinColumn()
    author: Users

    @OneToMany(()=>Comments, comment => comment.blog)
    @JoinColumn()
    comments: Comments[]

    @Column({nullable: true, type: "simple-array"})
    keywords: string

    @Column({nullable: true})
    category: string

}