import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { RefreshToken } from 'src/modules/auth/entities/refreshToken.entity';
import { Bookmark } from 'src/modules/bookmarks/entities/bookmark.entity';
import { Comment } from 'src/modules/comments/entities/comment.entity';
import { Post } from 'src/modules/posts/entities/post.entity';
import { Relationship } from 'src/modules/users/entities/relationship.entity';
import { User } from 'src/modules/users/entities/user.entity';

export default {
  sqlConfig: {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'dbuser',
    password: 'dbpassword',
    database: 'dbname',
    entities: [Post, User, Comment, RefreshToken, Relationship, Bookmark],
    synchronize: true, // not to be used in prod
  } satisfies TypeOrmModuleOptions,
  jwtModuleConfig: {
    secret: 'SECRET',
    refreshSecret: 'REFRESH_SECRET',
  },
  cookieConfig: {
    secret: 'COOKIE_SECRET',
    maxAge: 60 * 60 * 24 * 1000,
  },
};
