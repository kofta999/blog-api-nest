import { RefreshToken } from 'src/modules/auth/entities/refreshToken.entity';
import { Comment } from 'src/modules/comments/entities/comment.entity';
import { Post } from 'src/modules/posts/entities/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Relationship } from './relationship.entity';
import { Bookmark } from '../../bookmarks/entities/bookmark.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 30 })
  fullName: string;

  @Column('varchar', { length: 20, unique: true })
  username: string;

  @Column('varchar', { length: 255, unique: true })
  email: string;

  @Column('varchar', { length: 255, select: false })
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user, { onDelete: 'CASCADE' })
  comments: Comment[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.user, {
    onDelete: 'CASCADE',
  })
  bookmarks: Bookmark[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, {
    onDelete: 'CASCADE',
  })
  refreshTokens: RefreshToken[];

  @OneToMany(() => Relationship, (relationship) => relationship.follower, {
    onDelete: 'CASCADE',
  })
  following: Relationship[];

  @OneToMany(() => Relationship, (relationship) => relationship.followed, {
    onDelete: 'CASCADE',
  })
  followers: Relationship[];
}
