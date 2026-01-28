import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { AuctionsService } from './auctions/auctions.service';

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // Global Validation Pipe - validates all incoming requests
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Strip properties not in DTO
        forbidNonWhitelisted: true, // Throw error if unknown properties
        transform: true, // Transform payloads to DTO instances
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    // CORS Configuration - Only allow specific origins
    const allowedOrigins = [
      'http://localhost:4200',
      'http://localhost:4300',
      'https://mazzady.com',
      'https://www.mazzady.com',
      process.env.FRONTEND_URL,
    ].filter(Boolean);

    app.enableCors({
      origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) {
          callback(null, true);
          return;
        }
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'x-admin-authenticated',
        'x-admin-id',
        'Accept',
        'Origin',
      ],
    });

    // Serve static files from uploads directory
    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
      prefix: '/uploads',
    });
    const port = process.env.PORT ?? 3000;
    await app.listen(port);

    // Schedule auction status updates every minute
    const auctionsService = app.get(AuctionsService);
    setInterval(async () => {
      try {
        await auctionsService.updateAuctionStatus();
      } catch (error) {
        // Silently handle error - auction status update is non-critical
      }
    }, 60000); // Every minute
  } catch (error) {
    process.exit(1);
  }
}

void bootstrap();
