import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Blogs } from "./Blogs";
import { Users } from "./Users";

@Entity()
export class Comments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({ type: "timestamp" })
  created_at: Date;

  @ManyToOne(() => Blogs, (blog) => blog.comments)
  @JoinColumn()
  blog: Blogs;

  @ManyToOne(() => Users, (user) => user.comments)
  @JoinColumn()
  author: Users;
}
