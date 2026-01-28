import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('user/:userId')
  async getUserNotifications(
    @Param('userId') userId: string,
    @Query('limit') limit?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 50;
    return this.notificationsService.getUserNotifications(userId, limitNum);
  }

  @Get('user/:userId/unread')
  async getUnreadNotifications(@Param('userId') userId: string) {
    return this.notificationsService.getUnreadNotifications(userId);
  }

  @Get('user/:userId/unread-count')
  async getUnreadCount(@Param('userId') userId: string) {
    const count = await this.notificationsService.getUnreadCount(userId);
    return { count };
  }

  @Put(':id/read')
  async markAsRead(
    @Param('id') id: string,
    @Body() body: { userId: string },
  ) {
    await this.notificationsService.markAsRead(id, body.userId);
    return { message: 'Notification marked as read' };
  }

  @Put('user/:userId/read-all')
  async markAllAsRead(@Param('userId') userId: string) {
    await this.notificationsService.markAllAsRead(userId);
    return { message: 'All notifications marked as read' };
  }

  @Delete(':id')
  async deleteNotification(
    @Param('id') id: string,
    @Body() body: { userId: string },
  ) {
    await this.notificationsService.deleteNotification(id, body.userId);
    return { message: 'Notification deleted' };
  }

  @Delete('user/:userId/read')
  async deleteReadNotifications(@Param('userId') userId: string) {
    await this.notificationsService.deleteReadNotifications(userId);
    return { message: 'Read notifications deleted' };
  }
}
