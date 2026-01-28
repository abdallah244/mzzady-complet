import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  async sendMessage(@Body() body: { senderId: string; receiverId: string; message: string; auctionId?: string }) {
    return this.chatService.sendMessage(
      body.senderId,
      body.receiverId,
      body.message,
      body.auctionId,
    );
  }

  @Get('conversation/:userId1/:userId2')
  async getConversation(@Param('userId1') userId1: string, @Param('userId2') userId2: string) {
    return this.chatService.getConversation(userId1, userId2);
  }

  @Get('user/:userId/conversations')
  async getUserConversations(@Param('userId') userId: string) {
    return this.chatService.getUserConversations(userId);
  }

  @Put('read/:senderId/:receiverId')
  async markAsRead(@Param('senderId') senderId: string, @Param('receiverId') receiverId: string) {
    await this.chatService.markAsRead(senderId, receiverId);
    return { message: 'Messages marked as read' };
  }
}
