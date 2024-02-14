import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { CommentsModule } from './modules/comments/comments.module';
import { BookmarksModule } from './modules/bookmarks/bookmarks.module';
import config from './config/keys';

@Module({
  imports: [
    TypeOrmModule.forRoot(config.sqlConfig),
    AuthModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    BookmarksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
