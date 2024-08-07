import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './entities/category.entity';
import { FileUploadService } from 'src/common/services/file-upload.service';

@Module({
  imports:[
    MongooseModule.forFeature([{name:Category.name,schema:CategorySchema}])
  ],
  controllers: [CategoryController],
  providers: [CategoryService,FileUploadService],
})
export class CategoryModule {}
