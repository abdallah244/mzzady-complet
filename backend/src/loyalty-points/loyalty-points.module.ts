import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoyaltyPoints, LoyaltyPointsSchema } from '../schemas/loyalty-points.schema';
import { LoyaltyPointsController } from './loyalty-points.controller';
import { LoyaltyPointsService } from './loyalty-points.service';
import { UserStatisticsModule } from '../user-statistics/user-statistics.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LoyaltyPoints.name, schema: LoyaltyPointsSchema },
    ]),
    forwardRef(() => UserStatisticsModule),
  ],
  controllers: [LoyaltyPointsController],
  providers: [LoyaltyPointsService],
  exports: [LoyaltyPointsService],
})
export class LoyaltyPointsModule {}
