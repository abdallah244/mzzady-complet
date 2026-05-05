import { Injectable, Logger, Inject, Optional } from '@nestjs/common';
import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import { ImageStoreService } from './image-store/image-store.service';

@Injectable()
export class ImageCompressionService {
  private readonly logger = new Logger(ImageCompressionService.name);

  constructor(
    @Optional()
    @Inject(ImageStoreService)
    private readonly imageStore?: ImageStoreService,
  ) {}

  /**
   * Compress a single uploaded image file in-place.
   * Converts to WebP for smaller size, keeps original filename but changes extension.
   * Returns the new file path and filename.
   */
  async compressImage(
    filePath: string,
    options: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
    } = {},
  ): Promise<{ newPath: string; newFilename: string }> {
    const { maxWidth = 1200, maxHeight = 1200, quality = 80 } = options;

    try {
      const dir = path.dirname(filePath);
      const ext = path.extname(filePath);
      const baseName = path.basename(filePath, ext);
      const webpFilename = `${baseName}.webp`;
      const webpPath = path.join(dir, webpFilename);

      // Read original file size for logging
      const originalSize = fs.statSync(filePath).size;

      // Process with sharp: resize if too large + convert to WebP
      await sharp(filePath)
        .resize(maxWidth, maxHeight, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality })
        .toFile(webpPath);

      const newSize = fs.statSync(webpPath).size;
      const savings = Math.round(
        ((originalSize - newSize) / originalSize) * 100,
      );

      this.logger.log(
        `Compressed: ${path.basename(filePath)} → ${webpFilename} | ${(originalSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB (${savings}% saved)`,
      );

      // Remove original file
      try {
        fs.unlinkSync(filePath);
      } catch {
        // Ignore if can't delete original
      }

      return { newPath: webpPath, newFilename: webpFilename };
    } catch (error) {
      this.logger.warn(
        `Compression failed for ${filePath}, keeping original: ${error.message}`,
      );
      // Return original on failure
      return {
        newPath: filePath,
        newFilename: path.basename(filePath),
      };
    }
  }

  /**
   * Compress multiple uploaded files.
   * Returns array of { newPath, newFilename } in same order.
   */
  async compressImages(
    filePaths: string[],
    options: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
    } = {},
  ): Promise<{ newPath: string; newFilename: string }[]> {
    return Promise.all(filePaths.map((fp) => this.compressImage(fp, options)));
  }

  /**
   * Compress for profile avatars (smaller dimensions, higher quality)
   */
  async compressAvatar(
    filePath: string,
  ): Promise<{ newPath: string; newFilename: string }> {
    return this.compressImage(filePath, {
      maxWidth: 400,
      maxHeight: 400,
      quality: 85,
    });
  }

  /**
   * Compress for national ID images (preserve more detail)
   */
  async compressNationalId(
    filePath: string,
  ): Promise<{ newPath: string; newFilename: string }> {
    return this.compressImage(filePath, {
      maxWidth: 1600,
      maxHeight: 1600,
      quality: 85,
    });
  }

  /**
   * Compress for auction/product images
   */
  async compressProductImage(
    filePath: string,
  ): Promise<{ newPath: string; newFilename: string }> {
    return this.compressImage(filePath, {
      maxWidth: 1200,
      maxHeight: 1200,
      quality: 75,
    });
  }

  /**
   * Compress for home page / banner images
   */
  async compressHomeImage(
    filePath: string,
  ): Promise<{ newPath: string; newFilename: string }> {
    return this.compressImage(filePath, {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 80,
    });
  }

  // ─── MongoDB-backed compress + store methods ───

  /**
   * Compress an image and store it in MongoDB.
   * Returns the MongoDB-served URL: /images/<id>
   * Cleans up local temp files after storing.
   */
  async compressAndStore(
    filePath: string,
    options: { maxWidth?: number; maxHeight?: number; quality?: number } = {},
  ): Promise<string> {
    const compressed = await this.compressImage(filePath, options);

    if (!this.imageStore) {
      // Fallback: return local path if MongoDB store is unavailable
      return compressed.newFilename;
    }

    try {
      const buffer = fs.readFileSync(compressed.newPath);
      const url = await this.imageStore.saveFromBuffer(
        buffer,
        'image/webp',
        compressed.newFilename,
      );

      // Clean up local file
      try {
        fs.unlinkSync(compressed.newPath);
      } catch {
        // Ignore cleanup errors
      }

      return url;
    } catch (error) {
      this.logger.warn(
        `MongoDB store failed for ${compressed.newFilename}, using local path: ${error.message}`,
      );
      return compressed.newFilename;
    }
  }

  async compressAndStoreMultiple(
    filePaths: string[],
    options: { maxWidth?: number; maxHeight?: number; quality?: number } = {},
  ): Promise<string[]> {
    return Promise.all(
      filePaths.map((fp) => this.compressAndStore(fp, options)),
    );
  }

  async compressAndStoreAvatar(filePath: string): Promise<string> {
    return this.compressAndStore(filePath, {
      maxWidth: 400,
      maxHeight: 400,
      quality: 85,
    });
  }

  async compressAndStoreNationalId(filePath: string): Promise<string> {
    return this.compressAndStore(filePath, {
      maxWidth: 1600,
      maxHeight: 1600,
      quality: 85,
    });
  }

  async compressAndStoreProduct(filePath: string): Promise<string> {
    return this.compressAndStore(filePath, {
      maxWidth: 1200,
      maxHeight: 1200,
      quality: 75,
    });
  }

  async compressAndStoreHome(filePath: string): Promise<string> {
    return this.compressAndStore(filePath, {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 80,
    });
  }
}
