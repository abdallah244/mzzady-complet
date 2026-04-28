import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { HomeImage, HomeImageSchema } from '../schemas/home-image.schema';
import { ImageCompressionService } from '../image-compression.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HomeImage.name, schema: HomeImageSchema },
    ]),
  ],
  controllers: [HomeController],
  providers: [HomeService, ImageCompressionService],
  exports: [HomeService],
})
export class HomeModule {}
