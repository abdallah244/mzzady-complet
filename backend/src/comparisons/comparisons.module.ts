import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comparison, ComparisonSchema } from '../schemas/comparison.schema';
import { ComparisonsController } from './comparisons.controller';
import { ComparisonsService } from './comparisons.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comparison.name, schema: ComparisonSchema },
    ]),
  ],
  controllers: [ComparisonsController],
  providers: [ComparisonsService],
  exports: [ComparisonsService],
})
export class ComparisonsModule {}
