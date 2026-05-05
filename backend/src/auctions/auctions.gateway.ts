import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*', // In production, replace with specific origins
    credentials: true,
  },
  namespace: '/auctions',
})
export class AuctionsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AuctionsGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected to auctions: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected from auctions: ${client.id}`);
  }

  @SubscribeMessage('joinAuction')
  handleJoinAuction(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { auctionId: string },
  ) {
    if (data.auctionId) {
      client.join(`auction_${data.auctionId}`);
      this.logger.log(`Client ${client.id} joined auction room: ${data.auctionId}`);
      return { success: true };
    }
    return { success: false, message: 'Auction ID required' };
  }

  @SubscribeMessage('leaveAuction')
  handleLeaveAuction(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { auctionId: string },
  ) {
    if (data.auctionId) {
      client.leave(`auction_${data.auctionId}`);
      this.logger.log(`Client ${client.id} left auction room: ${data.auctionId}`);
      return { success: true };
    }
    return { success: false };
  }

  // Helper method to emit new bid to all users in the auction room
  emitNewBid(auctionId: string, bidData: any) {
    this.server.to(`auction_${auctionId}`).emit('newBid', bidData);
  }

  // Helper method to emit auction ended event
  emitAuctionEnded(auctionId: string, winnerData: any) {
    this.server.to(`auction_${auctionId}`).emit('auctionEnded', winnerData);
  }
}
