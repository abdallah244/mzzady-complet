import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { HomeModule } from './home/home.module';
import { MoneyRequestsModule } from './money-requests/money-requests.module';
import { CustomerSupportModule } from './customer-support/customer-support.module';
import { JobApplicationsModule } from './job-applications/job-applications.module';
import { AuctionProductsModule } from './auction-products/auction-products.module';
import { AuctionsModule } from './auctions/auctions.module';
import { BidsModule } from './bids/bids.module';
import { AdminMessagesModule } from './admin-messages/admin-messages.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RatingsModule } from './ratings/ratings.module';
import { WatchlistModule } from './watchlist/watchlist.module';
import { AutoBidModule } from './auto-bid/auto-bid.module';
import { ActivityHistoryModule } from './activity-history/activity-history.module';
import { UserStatisticsModule } from './user-statistics/user-statistics.module';
import { ShippingTrackingModule } from './shipping-tracking/shipping-tracking.module';
import { LoyaltyPointsModule } from './loyalty-points/loyalty-points.module';
import { ReportsModule } from './reports/reports.module';
import { ChatModule } from './chat/chat.module';
import { ReverseAuctionsModule } from './reverse-auctions/reverse-auctions.module';
import { FlashAuctionsModule } from './flash-auctions/flash-auctions.module';
import { PrivateAuctionsModule } from './private-auctions/private-auctions.module';
import { ComparisonsModule } from './comparisons/comparisons.module';
import { GroupAuctionsModule } from './group-auctions/group-auctions.module';
import { IdentityVerificationModule } from './identity-verification/identity-verification.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { PromotedAuctionsModule } from './promoted-auctions/promoted-auctions.module';
import { SellerLikesModule } from './seller-likes/seller-likes.module';
import { MongodbFallbackService } from './mongodb-fallback.service';
import { ImageCompressionService } from './image-compression.service';
import { ImageStoreModule } from './image-store/image-store.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Rate Limiting - Protection against brute force attacks
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 second
        limit: 3, // 3 requests per second
      },
      {
        name: 'medium',
        ttl: 10000, // 10 seconds
        limit: 20, // 20 requests per 10 seconds
      },
      {
        name: 'long',
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        let uri = configService.get<string>('MONGODB_URI');

        // If no URI provided, use local MongoDB
        if (!uri) {
          uri = 'mongodb://localhost:27017/projectdata';
          // Logger will be used by MongooseModule internally
        }

        // Check if it's Atlas connection (mongodb+srv://)
        const isAtlas = uri.startsWith('mongodb+srv://');

        const connectionOptions: any = {
          uri,
          retryWrites: true,
          w: 'majority',
          serverSelectionTimeoutMS: 10000,
          socketTimeoutMS: 45000,
          connectTimeoutMS: 15000,
          maxPoolSize: 20,
          minPoolSize: 2,
          maxIdleTimeMS: 30000,
          compressors: ['zlib'],
          autoIndex: process.env.NODE_ENV !== 'production',
        };

        // Add SSL options for Atlas
        if (isAtlas) {
          connectionOptions.tls = true;
          connectionOptions.tlsAllowInvalidCertificates = false;
          connectionOptions.tlsAllowInvalidHostnames = false;
        }

        return connectionOptions;
      },
      inject: [ConfigService],
    }),
    AuthModule,
    AdminModule,
    HomeModule,
    MoneyRequestsModule,
    CustomerSupportModule,
    JobApplicationsModule,
    AuctionProductsModule,
    AuctionsModule,
    BidsModule,
    AdminMessagesModule,
    ProductsModule,
    CartModule,
    NotificationsModule,
    RatingsModule,
    WatchlistModule,
    AutoBidModule,
    ActivityHistoryModule,
    UserStatisticsModule,
    ShippingTrackingModule,
    LoyaltyPointsModule,
    ReportsModule,
    ChatModule,
    ReverseAuctionsModule,
    FlashAuctionsModule,
    PrivateAuctionsModule,
    ComparisonsModule,
    GroupAuctionsModule,
    IdentityVerificationModule,
    RecommendationsModule,
    PromotedAuctionsModule,
    SellerLikesModule,
    ImageStoreModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    MongodbFallbackService,
    ImageCompressionService,
    // Global Rate Limiting Guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
