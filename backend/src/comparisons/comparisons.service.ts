import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comparison, ComparisonDocument } from '../schemas/comparison.schema';

@Injectable()
export class ComparisonsService {
  constructor(
    @InjectModel(Comparison.name)
    private comparisonModel: Model<ComparisonDocument>,
  ) {}

  async createComparison(
    userId: string,
    auctionIds: string[],
    name?: string,
  ): Promise<ComparisonDocument> {
    const comparison = new this.comparisonModel({
      userId: new Types.ObjectId(userId),
      auctionIds: auctionIds.map(id => new Types.ObjectId(id)),
      name,
    });

    return comparison.save();
  }

  async getUserComparisons(userId: string): Promise<ComparisonDocument[]> {
    return this.comparisonModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('auctionIds', 'productName mainImageUrl startingPrice highestBid endDate')
      .sort({ createdAt: -1 })
      .exec();
  }

  async deleteComparison(comparisonId: string, userId: string): Promise<void> {
    await this.comparisonModel.deleteOne({
      _id: new Types.ObjectId(comparisonId),
      userId: new Types.ObjectId(userId),
    });
  }
}
