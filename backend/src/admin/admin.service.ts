import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import {
  MoneyRequest,
  MoneyRequestDocument,
} from '../schemas/money-request.schema';
import {
  CustomerSupport,
  CustomerSupportDocument,
  SupportStatus,
} from '../schemas/customer-support.schema';
import {
  JobApplication,
  JobApplicationDocument,
} from '../schemas/job-application.schema';
import {
  AuctionProduct,
  AuctionProductDocument,
} from '../schemas/auction-product.schema';
import { Auction, AuctionDocument } from '../schemas/auction.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(MoneyRequest.name)
    private moneyRequestModel: Model<MoneyRequestDocument>,
    @InjectModel(CustomerSupport.name)
    private customerSupportModel: Model<CustomerSupportDocument>,
    @InjectModel(JobApplication.name)
    private jobApplicationModel: Model<JobApplicationDocument>,
    @InjectModel(AuctionProduct.name)
    private auctionProductModel: Model<AuctionProductDocument>,
    @InjectModel(Auction.name) private auctionModel: Model<AuctionDocument>,
  ) {}

  async getAllUsers() {
    const users = await this.userModel
      .find({}, { password: 0 })
      .sort({ createdAt: -1 });

    return users.map((user) => {
      const userObj = user.toObject() as any;
      return {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        nickname: user.nickname,
        phone: user.phone,
        nationalId: user.nationalId,
        profileImageUrl: user.profileImageUrl || null,
        nationalIdFrontUrl: user.nationalIdFrontUrl || null,
        nationalIdBackUrl: user.nationalIdBackUrl || null,
        visitsThisMonth: user.visitsThisMonth || 0,
        isOnline: user.isOnline || false,
        lastActivity: user.lastActivity || userObj.createdAt,
        createdAt: userObj.createdAt,
      };
    });
  }

  async getUsersStats() {
    const totalUsers = await this.userModel.countDocuments();
    const onlineUsers = await this.userModel.countDocuments({ isOnline: true });
    const offlineUsers = totalUsers - onlineUsers;

    const users = await this.userModel.find({}, { visitsThisMonth: 1 });
    const totalVisits = users.reduce(
      (sum, user) => sum + (user.visitsThisMonth || 0),
      0,
    );

    return {
      totalUsers,
      onlineUsers,
      offlineUsers,
      totalVisits,
    };
  }

  async deleteUser(id: string) {
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User deleted successfully' };
  }

  async updateUserActivity(userId: string, isOnline: boolean) {
    await this.userModel.findByIdAndUpdate(userId, {
      isOnline,
      lastActivity: new Date(),
    });
  }

  async incrementUserVisits(userId: string) {
    await this.userModel.findByIdAndUpdate(userId, {
      $inc: { visitsThisMonth: 1 },
      lastActivity: new Date(),
    });
  }

  async getDashboardStats() {
    const [
      totalUsers,
      onlineUsers,
      pendingMoneyRequests,
      pendingCustomerSupport,
      pendingJobApplications,
      pendingAuctionProducts,
      activeAuctions,
      totalAuctions,
    ] = await Promise.all([
      this.userModel.countDocuments(),
      this.userModel.countDocuments({ isOnline: true }),
      this.moneyRequestModel.countDocuments({ status: 'pending' }),
      this.customerSupportModel.countDocuments({
        status: SupportStatus.PENDING,
      }),
      this.jobApplicationModel.countDocuments({ status: 'pending' }),
      this.auctionProductModel.countDocuments({ status: 'pending' }),
      this.auctionModel.countDocuments({ status: 'active' }),
      this.auctionModel.countDocuments(),
    ]);

    return {
      users: {
        total: totalUsers,
        online: onlineUsers,
      },
      moneyRequests: {
        pending: pendingMoneyRequests,
      },
      customerSupport: {
        pending: pendingCustomerSupport,
      },
      jobApplications: {
        pending: pendingJobApplications,
      },
      auctionProducts: {
        pending: pendingAuctionProducts,
      },
      auctions: {
        active: activeAuctions,
        total: totalAuctions,
      },
    };
  }

  // Public stats for home page (no authentication required)
  async getPublicStats() {
    const [totalUsers, totalProducts, endedAuctions] = await Promise.all([
      this.userModel.countDocuments(),
      this.auctionProductModel.countDocuments({
        status: { $in: ['approved', 'rejected'] },
      }),
      this.auctionModel.countDocuments({ status: 'ended' }),
    ]);

    return {
      totalUsers,
      totalProducts,
      endedAuctions,
    };
  }
}
