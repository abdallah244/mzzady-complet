import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AdminMessage, AdminMessageDocument } from '../schemas/admin-message.schema';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class AdminMessagesService {
  constructor(
    @InjectModel(AdminMessage.name)
    private adminMessageModel: Model<AdminMessageDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async sendMessage(userId: string, subject: string, message: string): Promise<AdminMessageDocument> {
    // Validate user exists
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate inputs
    if (!subject || !message) {
      throw new BadRequestException('Subject and message are required');
    }

    const adminMessage = new this.adminMessageModel({
      userId: new Types.ObjectId(userId),
      subject,
      message,
      read: false,
    });

    return adminMessage.save();
  }

  async getUserMessages(userId: string): Promise<AdminMessageDocument[]> {
    return this.adminMessageModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async markAsRead(messageId: string, userId: string): Promise<AdminMessageDocument> {
    const message = await this.adminMessageModel.findOne({
      _id: new Types.ObjectId(messageId),
      userId: new Types.ObjectId(userId),
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    message.read = true;
    return message.save();
  }

  async getAllMessages(): Promise<AdminMessageDocument[]> {
    return this.adminMessageModel
      .find()
      .populate({
        path: 'userId',
        select: 'firstName middleName lastName email nickname',
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async deleteMessage(messageId: string, userId: string): Promise<void> {
    const message = await this.adminMessageModel.findOne({
      _id: new Types.ObjectId(messageId),
      userId: new Types.ObjectId(userId),
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    await this.adminMessageModel.deleteOne({ _id: new Types.ObjectId(messageId) });
  }
}

