import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportType, ReportStatus } from '../schemas/report.schema';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  async createReport(@Body() body: { reporterId: string; reportType: ReportType; reason: string; description?: string; auctionId?: string; reportedUserId?: string; productId?: string }) {
    return this.reportsService.createReport(
      body.reporterId,
      body.reportType,
      body.reason,
      body.description,
      body.auctionId,
      body.reportedUserId,
      body.productId,
    );
  }

  @Get()
  async getAllReports() {
    return this.reportsService.getAllReports();
  }

  @Put(':id/review')
  async reviewReport(@Param('id') id: string, @Body() body: { adminId: string; status: ReportStatus; adminResponse?: string }) {
    return this.reportsService.reviewReport(id, body.adminId, body.status, body.adminResponse);
  }
}
