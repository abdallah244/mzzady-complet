import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AuctionsService } from './auctions/auctions.service';
import { existsSync, mkdirSync } from 'fs';
import compression from 'compression';
import helmet from 'helmet';
import { getConnectionToken } from '@nestjs/mongoose';

const logger = new Logger('Bootstrap');

// Ensure all upload directories exist (critical for Heroku ephemeral FS)
function ensureUploadDirs() {
  const dirs = [
    './uploads',
    './uploads/national-ids',
    './uploads/profiles',
    './uploads/products',
    './uploads/auction-products',
    './uploads/auctions',
    './uploads/deposits',
    './uploads/home',
    './uploads/cvs',
  ];
  for (const dir of dirs) {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
      logger.log(`Created upload directory: ${dir}`);
    }
  }
}

async function bootstrap() {
  try {
    // Ensure upload directories exist before starting
    ensureUploadDirs();

    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger:
        process.env.NODE_ENV === 'production'
          ? ['error', 'warn', 'log']
          : ['error', 'warn', 'log', 'debug', 'verbose'],
    });

    // Security headers
    app.use(
      helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        contentSecurityPolicy: false, // Disable CSP to allow API usage from any frontend
      }),
    );

    // Gzip compression - reduces response sizes by ~70%
    app.use(
      compression({
        threshold: 1024, // Only compress responses > 1KB
        level: 6, // Balanced compression level
      }),
    );

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
      'https://mazzady.works',
      'https://www.mazzady.works',
      'https://mazzady.vercel.app',
      'https://mazzady-frontend.vercel.app',
      'https://mazzadi-frontend.vercel.app',
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

    // Serve static files from uploads directory with aggressive caching
    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
      prefix: '/uploads',
      maxAge: '7d', // Cache static files for 7 days
      etag: true,
      lastModified: true,
      immutable: true, // Tell browsers the file won't change
      setHeaders: (res, path) => {
        // Extra-long cache for home page images (they rarely change)
        if (path.includes('/home/')) {
          res.setHeader('Cache-Control', 'public, max-age=2592000, immutable'); // 30 days
        }
      },
    });

    const port = process.env.PORT ?? 3000;
    // Bind to 0.0.0.0 instead of default localhost, critical for Render, Heroku, Railway etc.
    await app.listen(port, '0.0.0.0');
    logger.log(`Application running on port ${port}`);
    logger.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

    // One-time migration: fix OAuth users with empty string phone/nationalId
    try {
      const connection = app.get(getConnectionToken());
      const usersCol = connection.collection('users');
      const r1 = await usersCol.updateMany({ phone: '' }, { $unset: { phone: 1 } });
      const r2 = await usersCol.updateMany({ nationalId: '' }, { $unset: { nationalId: 1 } });
      if (r1.modifiedCount || r2.modifiedCount) {
        logger.log(`Migration: fixed ${r1.modifiedCount} empty phones, ${r2.modifiedCount} empty nationalIds`);
      }
      // Drop and recreate phone index as sparse+unique to be safe
      try {
        await usersCol.dropIndex('phone_1');
        await usersCol.createIndex({ phone: 1 }, { unique: true, sparse: true });
        logger.log('Recreated phone_1 index as sparse+unique');
      } catch { /* index may not exist */ }
      try {
        await usersCol.dropIndex('nationalId_1');
        await usersCol.createIndex({ nationalId: 1 }, { unique: true, sparse: true });
        logger.log('Recreated nationalId_1 index as sparse+unique');
      } catch { /* index may not exist */ }
    } catch (e) {
      logger.warn('Migration skipped: ' + (e as Error).message);
    }

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
    logger.error('Failed to start application', error);
    process.exit(1);
  }
}

void bootstrap();
