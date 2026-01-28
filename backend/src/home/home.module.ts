import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { HomeImage, HomeImageSchema } from '../schemas/home-image.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HomeImage.name, schema: HomeImageSchema },
    ]),
  ],
  controllers: [HomeController],
  providers: [HomeService],
  exports: [HomeService],
})
export class HomeModule {}

