import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JobApplication, JobApplicationDocument } from '../schemas/job-application.schema';

@Injectable()
export class JobApplicationService {
  constructor(
    @InjectModel(JobApplication.name)
    private jobApplicationModel: Model<JobApplicationDocument>,
  ) {}

  async createApplication(
    userId: string,
    category: string,
    backupEmail: string,
    whatsappPhone: string,
    linkedinUrl: string | null,
    githubUrl: string | null,
    facebookUrl: string | null,
    cvFileUrl: string,
    cvFilename: string,
    experience: string,
  ): Promise<JobApplicationDocument> {
    const application = new this.jobApplicationModel({
      userId: new Types.ObjectId(userId) as any,
      category,
      backupEmail,
      whatsappPhone,
      linkedinUrl: linkedinUrl || null,
      githubUrl: githubUrl || null,
      facebookUrl: facebookUrl || null,
      cvFileUrl,
      cvFilename,
      experience,
      status: 'pending',
    });

    return application.save();
  }

  async getAllApplications(): Promise<JobApplicationDocument[]> {
    return this.jobApplicationModel
      .find()
      .populate({
        path: 'userId',
        select: 'firstName middleName lastName email profileImageUrl phone',
        model: 'User'
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getApplicationById(id: string): Promise<JobApplicationDocument | null> {
    return this.jobApplicationModel.findById(id).exec();
  }

  async updateApplicationStatus(
    id: string,
    status: 'pending' | 'reviewed' | 'accepted' | 'rejected',
  ): Promise<JobApplicationDocument | null> {
    return this.jobApplicationModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
  }

  async respondToApplication(
    id: string,
    status: 'accepted' | 'rejected',
    adminNote: string,
    reviewedBy: string,
  ): Promise<JobApplicationDocument | null> {
    return this.jobApplicationModel
      .findByIdAndUpdate(
        id,
        {
          status,
          adminNote,
          reviewedBy,
          reviewedAt: new Date(),
        },
        { new: true }
      )
      .exec();
  }

  async getApplicationByEmail(email: string): Promise<JobApplicationDocument[]> {
    return this.jobApplicationModel.find({ backupEmail: email }).sort({ createdAt: -1 }).exec();
  }

  async deleteApplication(id: string): Promise<boolean> {
    const result = await this.jobApplicationModel.findByIdAndDelete(id).exec();
    return !!result;
  }
}

