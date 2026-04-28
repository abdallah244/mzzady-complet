import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageStore, ImageStoreSchema } from '../schemas/image-store.schema';
import { ImageStoreService } from './image-store.service';
import { ImageStoreController } from './image-store.controller';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ImageStore.name, schema: ImageStoreSchema },
    ]),
  ],
  controllers: [ImageStoreController],
  providers: [ImageStoreService],
  exports: [ImageStoreService],
})
export class ImageStoreModule {}
