import { JwtModuleOptions } from '@nestjs/jwt';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Comment } from 'src/modules/comments/entities/comment.entity';
import { Post } from 'src/modules/posts/entities/post.entity';
import { User } from 'src/modules/users/entities/user.entity';

export default {
  sqlConfig: {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'dbuser',
    password: 'dbpassword',
    database: 'dbname',
    entities: [Post, User, Comment],
    synchronize: true, // not to be used in prod
  } satisfies TypeOrmModuleOptions,
  jwtConfig: {
    secret: 'SECRET',
  } satisfies JwtModuleOptions,
};
