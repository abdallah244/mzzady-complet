import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ChatMessage,
  ChatMessageDocument,
} from '../schemas/chat-message.schema';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatMessage.name)
    private chatMessageModel: Model<ChatMessageDocument>,
    private notificationsService: NotificationsService,
  ) {}

  // إرسال رسالة تلقائياً
  async sendMessage(
    senderId: string,
    receiverId: string,
    message: string,
    auctionId?: string,
  ): Promise<ChatMessageDocument> {
    const chatMessage = new this.chatMessageModel({
      senderId: new Types.ObjectId(senderId),
      receiverId: new Types.ObjectId(receiverId),
      message,
      auctionId: auctionId ? new Types.ObjectId(auctionId) : null,
      isRead: false,
    });

    await chatMessage.save();

    // إرسال إشعار تلقائي
    try {
      await this.notificationsService.createNotification(
        receiverId,
        'bid_placed' as any,
        'رسالة جديدة',
        message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        auctionId,
        undefined,
        `/chat/${senderId}`,
      );
    } catch (error) {
      console.error('Error sending chat notification:', error);
    }

    return chatMessage;
  }

  // الحصول على المحادثة
  async getConversation(
    userId1: string,
    userId2: string,
  ): Promise<ChatMessageDocument[]> {
    return this.chatMessageModel
      .find({
        $or: [
          {
            senderId: new Types.ObjectId(userId1),
            receiverId: new Types.ObjectId(userId2),
          },
          {
            senderId: new Types.ObjectId(userId2),
            receiverId: new Types.ObjectId(userId1),
          },
        ],
      })
      .populate('senderId', 'firstName lastName nickname profileImageUrl')
      .populate('receiverId', 'firstName lastName nickname profileImageUrl')
      .populate('auctionId', 'productName mainImageUrl')
      .sort({ createdAt: 1 })
      .exec();
  }

  // الحصول على جميع المحادثات للمستخدم
  async getUserConversations(userId: string): Promise<any[]> {
    const conversations = await this.chatMessageModel
      .find({
        $or: [
          { senderId: new Types.ObjectId(userId) },
          { receiverId: new Types.ObjectId(userId) },
        ],
      })
      .populate('senderId', 'firstName lastName nickname profileImageUrl')
      .populate('receiverId', 'firstName lastName nickname profileImageUrl')
      .populate('auctionId', 'productName mainImageUrl')
      .sort({ createdAt: -1 })
      .exec();

    // تجميع المحادثات حسب المستخدم الآخر
    const conversationMap = new Map();
    conversations.forEach((msg) => {
      const otherUserId =
        msg.senderId._id.toString() === userId
          ? msg.receiverId._id.toString()
          : msg.senderId._id.toString();

      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          userId: otherUserId,
          user:
            msg.senderId._id.toString() === userId
              ? msg.receiverId
              : msg.senderId,
          lastMessage: msg,
          unreadCount: 0,
        });
      }
    });

    return Array.from(conversationMap.values());
  }

  // تحديد الرسائل كمقروءة
  async markAsRead(senderId: string, receiverId: string): Promise<void> {
    await this.chatMessageModel.updateMany(
      {
        senderId: new Types.ObjectId(senderId),
        receiverId: new Types.ObjectId(receiverId),
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      },
    );
  }

  // تحديد الرسائل كمقروءة (للـ WebSocket)
  async markMessagesAsRead(userId: string, otherUserId: string): Promise<void> {
    await this.chatMessageModel.updateMany(
      {
        senderId: new Types.ObjectId(otherUserId),
        receiverId: new Types.ObjectId(userId),
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      },
    );
  }

  // الحصول على رسالة بالـ ID
  async getMessageById(messageId: string): Promise<ChatMessageDocument | null> {
    return this.chatMessageModel
      .findById(messageId)
      .populate('senderId', 'firstName lastName nickname profileImageUrl')
      .populate('receiverId', 'firstName lastName nickname profileImageUrl')
      .populate('auctionId', 'productName mainImageUrl')
      .exec();
  }

  // الحصول على عدد الرسائل غير المقروءة
  async getUnreadCount(userId: string): Promise<number> {
    return this.chatMessageModel.countDocuments({
      receiverId: new Types.ObjectId(userId),
      isRead: false,
    });
  }
}
