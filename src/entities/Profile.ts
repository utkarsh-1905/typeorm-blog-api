import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone_number: string;

  // @Column({nullable: true})
  // github: string

  // @Column({nullable: true})
  // medium: string

  // @Column({nullable: true})
  // linkedin: string

  // @Column({nullable: true})
  // instagram: string
}
