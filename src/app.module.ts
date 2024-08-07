import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/user.module';
import { LoginModule } from './auth/login.module';
import { CategoryModule } from './blogs/category/category.module';
import { TagModule } from './blogs/tag/tag.module';
import { BlogModule } from './blogs/blog/blog.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://lpsubedi2002:XOicrK1SiftFEdXE@blogsapp.jzrpcj1.mongodb.net/?retryWrites=true&w=majority&appName=blogsapp'),
    UserModule,
    LoginModule,
    CategoryModule,
    TagModule,
    BlogModule,
    ConfigModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
