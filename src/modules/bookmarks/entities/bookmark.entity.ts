import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Post } from 'src/modules/posts/entities/post.entity';

@Entity()
export class Bookmark {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bookmarks)
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Post, (post) => post.bookmarks)
  post: Post;
}
