import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Report, ReportDocument, ReportType, ReportStatus } from '../schemas/report.schema';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name)
    private reportModel: Model<ReportDocument>,
  ) {}

  // إنشاء بلاغ تلقائي
  async createReport(
    reporterId: string,
    reportType: ReportType,
    reason: string,
    description?: string,
    auctionId?: string,
    reportedUserId?: string,
    productId?: string,
  ): Promise<ReportDocument> {
    const report = new this.reportModel({
      reporterId: new Types.ObjectId(reporterId),
      reportType,
      reason,
      description,
      auctionId: auctionId ? new Types.ObjectId(auctionId) : null,
      reportedUserId: reportedUserId ? new Types.ObjectId(reportedUserId) : null,
      productId: productId ? new Types.ObjectId(productId) : null,
      status: ReportStatus.PENDING,
    });

    return report.save();
  }

  // الحصول على جميع البلاغات
  async getAllReports(): Promise<ReportDocument[]> {
    return this.reportModel
      .find()
      .populate('reporterId', 'firstName lastName email')
      .populate('reportedUserId', 'firstName lastName email')
      .populate('auctionId', 'productName')
      .sort({ createdAt: -1 })
      .exec();
  }

  // معالجة البلاغ
  async reviewReport(
    reportId: string,
    adminId: string,
    status: ReportStatus,
    adminResponse?: string,
  ): Promise<ReportDocument> {
    const report = await this.reportModel.findById(reportId);
    if (!report) {
      throw new Error('Report not found');
    }

    report.status = status;
    report.reviewedBy = new Types.ObjectId(adminId);
    report.adminResponse = adminResponse;
    report.reviewedAt = new Date();

    return report.save();
  }
}
