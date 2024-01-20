import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Post } from 'src/posts/entities/post.entity';

export default {
  sqlConfig: {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'dbuser',
    password: 'dbpassword',
    database: 'dbname',
    entities: [Post],
    synchronize: true, // not to be used in prod
  } satisfies TypeOrmModuleOptions,
};
