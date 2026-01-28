import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ShippingTracking, ShippingTrackingDocument, ShippingStatus } from '../schemas/shipping-tracking.schema';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ShippingTrackingService {
  constructor(
    @InjectModel(ShippingTracking.name)
    private shippingTrackingModel: Model<ShippingTrackingDocument>,
    private notificationsService: NotificationsService,
  ) {}

  // إنشاء تتبع شحنة تلقائياً بعد الشراء
  async createTracking(
    invoiceId: string,
    userId: string,
    shippingAddress: string,
  ): Promise<ShippingTrackingDocument> {
    const tracking = new this.shippingTrackingModel({
      invoiceId: new Types.ObjectId(invoiceId),
      userId: new Types.ObjectId(userId),
      status: ShippingStatus.PENDING,
      shippingAddress,
      trackingHistory: [
        {
          status: ShippingStatus.PENDING,
          timestamp: new Date(),
          description: 'تم إنشاء الشحنة',
        },
      ],
    });

    return tracking.save();
  }

  // تحديث حالة الشحن تلقائياً
  async updateStatus(
    invoiceId: string,
    status: ShippingStatus,
    location?: string,
    description?: string,
  ): Promise<ShippingTrackingDocument> {
    const tracking = await this.shippingTrackingModel.findOne({
      invoiceId: new Types.ObjectId(invoiceId),
    });

    if (!tracking) {
      throw new Error('Tracking not found');
    }

    tracking.status = status;
    tracking.trackingHistory.push({
      status,
      location,
      timestamp: new Date(),
      description,
    });

    if (status === ShippingStatus.SHIPPED) {
      tracking.shippedAt = new Date();
    } else if (status === ShippingStatus.DELIVERED) {
      tracking.deliveredAt = new Date();
    }

    await tracking.save();

    // إرسال إشعار تلقائي
    await this.notificationsService.notifyShippingUpdate(
      tracking.userId.toString(),
      invoiceId,
      status,
      description || `تم تحديث حالة الشحنة إلى: ${status}`,
    );

    return tracking;
  }

  // الحصول على تتبع الشحنة
  async getTracking(invoiceId: string): Promise<ShippingTrackingDocument | null> {
    return this.shippingTrackingModel
      .findOne({ invoiceId: new Types.ObjectId(invoiceId) })
      .exec();
  }

  // الحصول على جميع الشحنات للمستخدم
  async getUserShipments(userId: string): Promise<ShippingTrackingDocument[]> {
    return this.shippingTrackingModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('invoiceId')
      .sort({ createdAt: -1 })
      .exec();
  }
}
