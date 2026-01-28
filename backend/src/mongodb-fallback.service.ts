import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class MongodbFallbackService implements OnModuleInit {
  private readonly logger = new Logger(MongodbFallbackService.name);

  constructor(@InjectConnection() private connection: Connection) {}

  async onModuleInit() {
    // Check connection after a delay
    setTimeout(async () => {
      await this.checkConnection();
    }, 3000);
  }

  private async checkConnection() {
    try {
      if (!this.connection) {
        this.logger.warn('⚠️  MongoDB connection not available');
        return;
      }

      const state = this.connection.readyState;

      // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
      if (state === 0) {
        this.logger.warn('⚠️  MongoDB connection failed!');
        this.logger.warn('📋 Possible solutions:');
        this.logger.warn(
          '   1. Add your IP address to MongoDB Atlas Network Access',
        );
        this.logger.warn(
          '   2. Use local MongoDB: MONGODB_URI=mongodb://localhost:27017/projectdata',
        );
        this.logger.warn('   3. Check your connection string in .env file');
        this.logger.warn('');
        this.logger.warn('🔗 MongoDB Atlas Network Access:');
        this.logger.warn(
          '   https://cloud.mongodb.com/ → Network Access → Add IP Address',
        );
        this.logger.warn('');
        this.logger.warn('💡 Quick fix - Use local MongoDB:');
        this.logger.warn('   In backend/.env file, set:');
        this.logger.warn(
          '   MONGODB_URI=mongodb://localhost:27017/projectdata',
        );
      } else if (state === 1) {
        this.logger.log('✅ MongoDB connected successfully!');
      } else if (state === 2) {
        this.logger.log('🔄 MongoDB is connecting...');
      }
    } catch (error) {
      // Silently handle errors - connection might not be ready yet
      // The MongooseModule will handle connection errors and retry
    }
  }
}
