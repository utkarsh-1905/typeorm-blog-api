import { Entity, Column, PrimaryGeneratedColumn, Generated } from "typeorm";

@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  password: string;

  @Column()
  @Generated("uuid")
  token: string;
}
