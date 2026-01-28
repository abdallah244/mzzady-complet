import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  MoneyRequest,
  MoneyRequestDocument,
} from '../schemas/money-request.schema';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class MoneyRequestsService {
  constructor(
    @InjectModel(MoneyRequest.name)
    private moneyRequestModel: Model<MoneyRequestDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async createRequest(
    userId: string,
    amount: number,
    phoneNumber: string,
    depositImageUrl: string,
    depositImageFilename: string,
  ): Promise<MoneyRequestDocument> {
    // Mongoose will automatically convert userId string to ObjectId
    const request = new this.moneyRequestModel({
      userId: userId,
      amount,
      phoneNumber,
      depositImageUrl,
      depositImageFilename,
      status: 'pending',
    });
    return request.save();
  }

  async getAllRequests(): Promise<MoneyRequestDocument[]> {
    try {
      const requests = await this.moneyRequestModel
        .find()
        .populate({
          path: 'userId',
          select: 'firstName middleName lastName email profileImageUrl phone',
          model: 'User',
        })
        .populate({
          path: 'reviewedBy',
          select: 'firstName middleName lastName email',
          model: 'User',
        })
        .sort({ createdAt: -1 })
        .exec();

      return requests;
    } catch (error) {
      // If populate fails, try without populate
      try {
        const requestsWithoutPopulate = await this.moneyRequestModel
          .find()
          .sort({ createdAt: -1 })
          .exec();
        return requestsWithoutPopulate;
      } catch (fallbackError) {
        throw error;
      }
    }
  }

  async getRequestById(id: string): Promise<MoneyRequestDocument | null> {
    return this.moneyRequestModel
      .findById(id)
      .populate({
        path: 'userId',
        select: 'firstName middleName lastName email profileImageUrl phone',
        model: 'User',
      })
      .populate({
        path: 'reviewedBy',
        select: 'firstName middleName lastName email',
        model: 'User',
      })
      .exec();
  }

  async getUserRequests(userId: string): Promise<MoneyRequestDocument[]> {
    // Convert userId string to ObjectId for query
    const userIdObjectId = Types.ObjectId.isValid(userId)
      ? new Types.ObjectId(userId)
      : userId;
    return this.moneyRequestModel
      .find({ userId: userIdObjectId as any })
      .populate({
        path: 'userId',
        select: 'firstName middleName lastName email profileImageUrl phone',
        model: 'User',
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async approveRequest(
    id: string,
    reviewedBy: string,
    reviewNote?: string,
  ): Promise<MoneyRequestDocument | null> {
    const request = await this.moneyRequestModel.findById(id);
    if (!request) {
      return null;
    }

    request.status = 'approved';
    // Convert reviewedBy string to ObjectId if it's a valid ObjectId string
    if (reviewedBy && Types.ObjectId.isValid(reviewedBy)) {
      request.reviewedBy = new Types.ObjectId(reviewedBy) as any;
    }
    if (reviewNote) {
      request.reviewNote = reviewNote;
    }

    // Add amount to user's wallet balance
    const user = await this.userModel.findById(request.userId);
    if (user) {
      // Assuming walletBalance field exists, if not we'll add it
      if (!user.walletBalance) {
        user.walletBalance = 0;
      }
      user.walletBalance += request.amount;
      await user.save();
    }

    return request.save();
  }

  async rejectRequest(
    id: string,
    reviewedBy: string,
    reviewNote?: string,
  ): Promise<MoneyRequestDocument | null> {
    const request = await this.moneyRequestModel.findById(id);
    if (!request) {
      return null;
    }

    request.status = 'rejected';
    // Convert reviewedBy string to ObjectId if it's a valid ObjectId string
    if (reviewedBy && Types.ObjectId.isValid(reviewedBy)) {
      request.reviewedBy = new Types.ObjectId(reviewedBy) as any;
    }
    if (reviewNote) {
      request.reviewNote = reviewNote;
    }

    return request.save();
  }

  async deleteRequest(id: string): Promise<boolean> {
    const result = await this.moneyRequestModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}
