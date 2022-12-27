import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Blogs } from "./Blogs";
import { Comments } from "./Comments";
import { Profile } from "./Profile";
import { Auth } from "./Auth";

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  username: string;

  @OneToOne(() => Auth, { cascade: true })
  @JoinColumn()
  auth: Auth;

  @OneToOne(() => Profile, { cascade: true })
  @JoinColumn()
  profile: Profile;

  @OneToMany(() => Blogs, (blog) => blog.author, {
    nullable: true,
  })
  blogs: Blogs[];

  @OneToMany(() => Comments, (comment) => comment.author, {
    nullable: true,
  })
  comments: Comments[];
}
