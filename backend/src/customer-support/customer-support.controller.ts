import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CustomerSupportService } from './customer-support.service';
import { AdminGuard } from '../auth/admin.guard';
import { SupportStatus } from '../schemas/customer-support.schema';

@Controller('customer-support')
export class CustomerSupportController {
  constructor(
    private readonly customerSupportService: CustomerSupportService,
  ) {}

  @Post()
  async createTicket(
    @Body()
    body: {
      userId: string;
      category: string;
      subject: string;
      message: string;
    },
  ) {
    if (!body.userId || !body.category || !body.subject || !body.message) {
      throw new BadRequestException('All fields are required');
    }

    return this.customerSupportService.createTicket(
      body.userId,
      body.category,
      body.subject,
      body.message,
    );
  }

  @Get('user/:userId')
  async getUserTickets(@Param('userId') userId: string) {
    return this.customerSupportService.getUserTickets(userId);
  }

  @Get()
  @UseGuards(AdminGuard)
  async getAllTickets(@Req() req: any) {
    return this.customerSupportService.getAllTickets();
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  async getTicketById(@Param('id') id: string) {
    const ticket = await this.customerSupportService.getTicketById(id);
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    return ticket;
  }

  @Put(':id/respond')
  @UseGuards(AdminGuard)
  async respondToTicket(
    @Param('id') id: string,
    @Body() body: { adminResponse: string; status: SupportStatus },
    @Req() req: any,
  ) {
    if (!body.adminResponse || !body.status) {
      throw new BadRequestException('All fields are required');
    }

    // Get admin ID from JWT user, session, or header
    const reviewedBy =
      req.user?.sub ||
      req.user?.id ||
      req.session?.adminId ||
      req.headers['x-admin-id'] ||
      'system-admin';

    return this.customerSupportService.respondToTicket(
      id,
      reviewedBy,
      body.adminResponse,
      body.status,
    );
  }

  @Put(':id/status')
  @UseGuards(AdminGuard)
  async updateTicketStatus(
    @Param('id') id: string,
    @Body() body: { status: SupportStatus },
  ) {
    if (!body.status) {
      throw new BadRequestException('Status is required');
    }

    return this.customerSupportService.updateTicketStatus(id, body.status);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async deleteTicket(@Param('id') id: string) {
    return this.customerSupportService.deleteTicket(id);
  }

  @Delete('user/:userId/:id')
  async deleteUserTicket(
    @Param('userId') userId: string,
    @Param('id') id: string,
  ) {
    const ticket = await this.customerSupportService.getTicketById(id);
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    const ticketUserId = ticket.userId.toString();
    if (ticketUserId !== userId) {
      throw new BadRequestException(
        'Unauthorized: You can only delete your own tickets',
      );
    }

    if (ticket.status === SupportStatus.PENDING) {
      throw new BadRequestException('Cannot delete pending tickets');
    }

    return this.customerSupportService.deleteTicket(id);
  }
}
