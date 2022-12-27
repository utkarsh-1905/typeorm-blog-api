import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Users } from "./Users";
import { Comments } from "./Comments";
@Entity()
export class Blogs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ length: 5000 })
  content: string;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: 0 })
  dislikes: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @ManyToOne(() => Users, (user) => user.blogs)
  author: Users;

  @OneToMany(() => Comments, (comment) => comment.blog, {
    nullable: true,
  })
  @JoinColumn()
  comments: Comments[];

  @Column({ nullable: true, type: "simple-array" })
  keywords: string;

  //link to a category table
  @Column({ nullable: true, type: "simple-array" })
  category: string;
}
