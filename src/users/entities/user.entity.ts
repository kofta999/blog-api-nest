import { Comment } from 'src/comments/entities/comment.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 30 })
  fullName: string;

  @Column('varchar', { length: 20 })
  username: string;

  @Column('varchar', { length: 255 })
  email: string;

  @Column('varchar', { length: 255 })
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
