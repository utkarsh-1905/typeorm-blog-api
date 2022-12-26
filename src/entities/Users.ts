import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  Generated,
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

  @OneToMany(() => Blogs, (blog) => blog.id, { cascade: true, nullable: true })
  @JoinColumn()
  blogs: Blogs[];

  @OneToMany(() => Comments, (comment) => comment.id, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  comments: Comments[];
}
