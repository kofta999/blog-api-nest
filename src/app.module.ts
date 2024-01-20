import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { MongooseModule } from '@nestjs/mongoose';
// import { ItemsModule } from './items/items.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './config/keys';

@Module({
  imports: [
    // ItemsModule,
    TypeOrmModule.forRoot(config.sqlConfig),
    // MongooseModule.forRoot(config.mongoURI),
    UsersModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
