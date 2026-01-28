import { Controller, Get, Put, Param } from '@nestjs/common';
import { UserStatisticsService } from './user-statistics.service';

@Controller('user-statistics')
export class UserStatisticsController {
  constructor(private readonly userStatisticsService: UserStatisticsService) {}

  @Get('user/:userId')
  async getUserStatistics(@Param('userId') userId: string) {
    return this.userStatisticsService.getUserStatistics(userId);
  }

  @Put('user/:userId/update')
  async updateUserStatistics(@Param('userId') userId: string) {
    return this.userStatisticsService.updateUserStatistics(userId);
  }
}
