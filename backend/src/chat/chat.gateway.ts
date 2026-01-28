import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { Logger } from '@nestjs/common';

interface UserSocket {
  socketId: string;
  userId: string;
}

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:4200',
      'http://localhost:4300',
      'https://mazzady.com',
      'https://www.mazzady.com',
    ],
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private connectedUsers: Map<string, string> = new Map(); // userId -> socketId

  constructor(private chatService: ChatService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // Remove user from connected users
    for (const [userId, socketId] of this.connectedUsers.entries()) {
      if (socketId === client.id) {
        this.connectedUsers.delete(userId);
        this.logger.log(`User ${userId} disconnected`);
        break;
      }
    }
  }

  @SubscribeMessage('join')
  handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string },
  ) {
    if (data.userId) {
      this.connectedUsers.set(data.userId, client.id);
      client.join(`user_${data.userId}`);
      this.logger.log(`User ${data.userId} joined with socket ${client.id}`);
      return { success: true, message: 'Joined successfully' };
    }
    return { success: false, message: 'User ID required' };
  }

  @SubscribeMessage('leave')
  handleLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string },
  ) {
    if (data.userId) {
      this.connectedUsers.delete(data.userId);
      client.leave(`user_${data.userId}`);
      this.logger.log(`User ${data.userId} left`);
      return { success: true };
    }
    return { success: false };
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      senderId: string;
      receiverId: string;
      message: string;
      auctionId?: string;
    },
  ) {
    try {
      // Save message to database
      const savedMessage = await this.chatService.sendMessage(
        data.senderId,
        data.receiverId,
        data.message,
        data.auctionId,
      );

      // Populate the saved message
      const populatedMessage = await this.chatService.getMessageById(
        savedMessage._id.toString(),
      );

      // Send to receiver if online
      const receiverSocketId = this.connectedUsers.get(data.receiverId);
      if (receiverSocketId) {
        this.server.to(receiverSocketId).emit('newMessage', populatedMessage);
      }

      // Also emit to receiver's room
      this.server
        .to(`user_${data.receiverId}`)
        .emit('newMessage', populatedMessage);

      // Confirm to sender
      return { success: true, message: populatedMessage };
    } catch (error) {
      this.logger.error('Error sending message:', error);
      return { success: false, error: 'Failed to send message' };
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { senderId: string; receiverId: string; isTyping: boolean },
  ) {
    const receiverSocketId = this.connectedUsers.get(data.receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('userTyping', {
        userId: data.senderId,
        isTyping: data.isTyping,
      });
    }
    // Also emit to receiver's room
    this.server.to(`user_${data.receiverId}`).emit('userTyping', {
      userId: data.senderId,
      isTyping: data.isTyping,
    });
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string; otherUserId: string },
  ) {
    try {
      await this.chatService.markMessagesAsRead(data.userId, data.otherUserId);

      // Notify the other user that messages were read
      const otherUserSocketId = this.connectedUsers.get(data.otherUserId);
      if (otherUserSocketId) {
        this.server.to(otherUserSocketId).emit('messagesRead', {
          userId: data.userId,
        });
      }

      return { success: true };
    } catch (error) {
      this.logger.error('Error marking messages as read:', error);
      return { success: false, error: 'Failed to mark as read' };
    }
  }

  // Method to send notification to a specific user (can be called from other services)
  sendNotificationToUser(userId: string, event: string, data: any) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.server.to(socketId).emit(event, data);
    }
    this.server.to(`user_${userId}`).emit(event, data);
  }

  // Check if user is online
  isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  // Get all online users
  getOnlineUsers(): string[] {
    return Array.from(this.connectedUsers.keys());
  }
}
