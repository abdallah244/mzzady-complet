import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivityHistory, ActivityHistorySchema } from '../schemas/activity-history.schema';
import { ActivityHistoryController } from './activity-history.controller';
import { ActivityHistoryService } from './activity-history.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ActivityHistory.name, schema: ActivityHistorySchema },
    ]),
  ],
  controllers: [ActivityHistoryController],
  providers: [ActivityHistoryService],
  exports: [ActivityHistoryService],
})
export class ActivityHistoryModule {}
