import { Controller, Get, Param, Query } from '@nestjs/common';
import { ActivityHistoryService } from './activity-history.service';

@Controller('activity-history')
export class ActivityHistoryController {
  constructor(private readonly activityHistoryService: ActivityHistoryService) {}

  @Get('user/:userId')
  async getUserActivity(@Param('userId') userId: string, @Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 50;
    return this.activityHistoryService.getUserActivity(userId, limitNum);
  }
}
