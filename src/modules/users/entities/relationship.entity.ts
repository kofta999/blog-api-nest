import {
  Column,
  Entity,
  // Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
// @Index(['followerId', 'followedId'], { unique: true })
export class Relationship {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  followerId: string;

  @Column()
  followedId: string;

  @ManyToOne(() => User, (user) => user.following)
  follower: User;

  @ManyToOne(() => User, (user) => user.followers)
  followed: User;
}
