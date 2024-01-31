import { JwtModuleOptions } from '@nestjs/jwt';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';

export default {
  sqlConfig: {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'dbuser',
    password: 'dbpassword',
    database: 'dbname',
    entities: [Post, User],
    synchronize: true, // not to be used in prod
  } satisfies TypeOrmModuleOptions,
  jwtConfig: {
    secret: 'SECRET',
  } satisfies JwtModuleOptions,
};
