import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AdminMessagesService } from './admin-messages.service';
import { AdminGuard } from '../auth/admin.guard';

@Controller('admin-messages')
export class AdminMessagesController {
  constructor(private readonly adminMessagesService: AdminMessagesService) {}

  @Post()
  @UseGuards(AdminGuard)
  async sendMessage(@Body() body: { userId: string; subject: string; message: string }) {
    const { userId, subject, message } = body;
    return this.adminMessagesService.sendMessage(userId, subject, message);
  }

  @Get()
  @UseGuards(AdminGuard)
  async getAllMessages() {
    return this.adminMessagesService.getAllMessages();
  }

  @Get('user/:userId')
  async getUserMessages(@Param('userId') userId: string) {
    return this.adminMessagesService.getUserMessages(userId);
  }

  @Put(':id/read')
  async markAsRead(@Param('id') id: string, @Body() body: { userId: string }) {
    const { userId } = body;
    return this.adminMessagesService.markAsRead(id, userId);
  }

  @Delete('user/:userId/:id')
  async deleteMessage(@Param('id') id: string, @Param('userId') userId: string) {
    await this.adminMessagesService.deleteMessage(id, userId);
    return { message: 'Message deleted successfully' };
  }
}

