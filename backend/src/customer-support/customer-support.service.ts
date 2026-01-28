import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CustomerSupport, CustomerSupportDocument, SupportStatus } from '../schemas/customer-support.schema';

@Injectable()
export class CustomerSupportService {
  constructor(
    @InjectModel(CustomerSupport.name)
    private customerSupportModel: Model<CustomerSupportDocument>,
  ) {}

  async createTicket(
    userId: string,
    category: string,
    subject: string,
    message: string,
  ): Promise<CustomerSupportDocument> {
    const ticket = new this.customerSupportModel({
      userId: new Types.ObjectId(userId),
      category,
      subject,
      message,
      status: SupportStatus.PENDING,
    });

    return ticket.save();
  }

  async getUserTickets(userId: string): Promise<CustomerSupportDocument[]> {
    const userIdObjectId = Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : userId;
    return this.customerSupportModel
      .find({ userId: userIdObjectId as any })
      .populate({
        path: 'userId',
        select: 'firstName middleName lastName email profileImageUrl phone',
        model: 'User'
      })
      .populate({
        path: 'reviewedBy',
        select: 'firstName middleName lastName email',
        model: 'User'
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getAllTickets(): Promise<CustomerSupportDocument[]> {
    return this.customerSupportModel
      .find()
      .populate({
        path: 'userId',
        select: 'firstName middleName lastName email profileImageUrl phone',
        model: 'User'
      })
      .populate({
        path: 'reviewedBy',
        select: 'firstName middleName lastName email',
        model: 'User'
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getTicketById(id: string): Promise<CustomerSupportDocument | null> {
    return this.customerSupportModel
      .findById(id)
      .populate({
        path: 'userId',
        select: 'firstName middleName lastName email profileImageUrl phone',
        model: 'User'
      })
      .populate({
        path: 'reviewedBy',
        select: 'firstName middleName lastName email',
        model: 'User'
      })
      .exec();
  }

  async respondToTicket(
    id: string,
    reviewedBy: string,
    adminResponse: string,
    status: SupportStatus,
  ): Promise<CustomerSupportDocument> {
    const ticket = await this.customerSupportModel.findById(id);
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    // Convert reviewedBy string to ObjectId if it's a valid ObjectId string
    if (reviewedBy && Types.ObjectId.isValid(reviewedBy)) {
      ticket.reviewedBy = new Types.ObjectId(reviewedBy) as any;
    } else {
      // If not a valid ObjectId, set to null (optional field)
      ticket.reviewedBy = undefined;
    }

    ticket.adminResponse = adminResponse;
    ticket.status = status;
    ticket.respondedAt = new Date();

    return ticket.save();
  }

  async updateTicketStatus(id: string, status: SupportStatus): Promise<CustomerSupportDocument> {
    const ticket = await this.customerSupportModel.findById(id);
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    ticket.status = status;
    return ticket.save();
  }

  async deleteTicket(id: string): Promise<boolean> {
    const result = await this.customerSupportModel.findByIdAndDelete(id);
    return !!result;
  }
}

