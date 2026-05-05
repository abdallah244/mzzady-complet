import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Put,
  Req,
  Res,
  BadRequestException,
  ConflictException,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  FileInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { storage } from '../cloudinary.config';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import type { Request, Response } from 'express';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ImageCompressionService } from '../image-compression.service';
import { Public } from './public.decorator';
import {
  RegisterDto,
  LoginDto,
  SendVerificationCodeDto,
  VerifyEmailCodeDto,
  VerifyOAuthCodeDto,
  RefreshTokenDto,
  GoogleSignInDto,
  FacebookSignInDto,
} from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly imageCompression: ImageCompressionService,
  ) {}

  @Post('register')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'nationalIdFront', maxCount: 1 },
        { name: 'nationalIdBack', maxCount: 1 },
      ],
      {
        storage: storage,
        fileFilter: (req, file, cb) => {
          if (file.mimetype.startsWith('image/')) {
            cb(null, true);
          } else {
            cb(
              new BadRequestException(
                'Only image files are allowed for national ID',
              ) as unknown as Error,
              false,
            );
          }
        },
        limits: {
          fileSize: 2 * 1024 * 1024, // 2MB per file
        },
      },
    ),
  )
  async register(
    @Body() registerDto: RegisterDto,
    @UploadedFiles()
    files: {
      nationalIdFront?: Array<{
        filename: string;
        path: string;
        mimetype: string;
        size: number;
      }>;
      nationalIdBack?: Array<{
        filename: string;
        path: string;
        mimetype: string;
        size: number;
      }>;
    },
  ) {
    const frontFile = files?.nationalIdFront?.[0];
    const backFile = files?.nationalIdBack?.[0];

    if (!frontFile || !backFile) {
      throw new BadRequestException(
        'Front and back national ID images are required',
      );
    }

    // Use Cloudinary URLs directly (file.path)
    const frontUrl = frontFile.path;
    const backUrl = backFile.path;

    return this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.firstName,
      registerDto.middleName,
      registerDto.lastName,
      registerDto.nickname,
      registerDto.phone,
      registerDto.nationalId,
      {
        frontUrl,
        backUrl,
        frontFilename: frontUrl,
        backFilename: backUrl,
      },
    );
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 attempts per minute for login
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(
      loginDto.email,
      loginDto.password,
      loginDto.rememberMe,
    );
  }

  @Post('refresh-token')
  async refreshToken(@Body() body: RefreshTokenDto) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @Post('logout')
  async logout(@Body() body: { userId: string }) {
    return this.authService.logout(body.userId);
  }

  @Get('check-user')
  async checkUser(@Query('email') email: string) {
    return this.authService.checkUserExists(email);
  }

  @Get('check-nickname')
  async checkNickname(@Query('nickname') nickname: string) {
    return this.authService.checkNicknameExists(nickname);
  }

  @Get('check-phone')
  async checkPhone(@Query('phone') phone: string) {
    return this.authService.checkPhoneExists(phone);
  }

  @Get('check-national-id')
  async checkNationalId(@Query('nationalId') nationalId: string) {
    return this.authService.checkNationalIdExists(nationalId);
  }

  @Get('wallet-balance/:userId')
  async getWalletBalance(@Param('userId') userId: string) {
    return this.authService.getWalletBalance(userId);
  }

  @Get('profile/:userId')
  async getProfile(@Param('userId') userId: string) {
    return this.authService.getProfile(userId);
  }

  @Put('profile/:userId')
  async updateProfile(
    @Param('userId') userId: string,
    @Body()
    body: {
      firstName?: string;
      middleName?: string;
      lastName?: string;
      phone?: string;
      nickname?: string;
      nationalId?: string;
    },
  ) {
    return this.authService.updateProfile(userId, body);
  }

  @Post('profile/:userId/national-id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'nationalIdFront', maxCount: 1 },
        { name: 'nationalIdBack', maxCount: 1 },
      ],
      {
        storage: storage,
        fileFilter: (req, file, cb) => {
          if (file.mimetype.startsWith('image/')) {
            cb(null, true);
          } else {
            cb(
              new BadRequestException(
                'Only image files are allowed for national ID',
              ) as unknown as Error,
              false,
            );
          }
        },
        limits: {
          fileSize: 2 * 1024 * 1024,
        },
      },
    ),
  )
  async uploadNationalId(
    @Param('userId') userId: string,
    @UploadedFiles()
    files: {
      nationalIdFront?: Array<{
        filename: string;
        path: string;
        mimetype: string;
        size: number;
      }>;
      nationalIdBack?: Array<{
        filename: string;
        path: string;
        mimetype: string;
        size: number;
      }>;
    },
  ) {
    const frontFile = files?.nationalIdFront?.[0];
    const backFile = files?.nationalIdBack?.[0];

    if (!frontFile || !backFile) {
      throw new BadRequestException(
        'Front and back national ID images are required',
      );
    }

    // Use Cloudinary URLs directly (file.path)
    const frontUrl = frontFile.path;
    const backUrl = backFile.path;

    return this.authService.uploadNationalIdImages(userId, {
      frontUrl,
      backUrl,
      frontFilename: frontUrl,
      backFilename: backUrl,
    });
  }

  @Post('profile/:userId/verify-email')
  async verifyProfileEmail(@Param('userId') userId: string) {
    return this.authService.markEmailVerified(userId);
  }

  @Post('profile/:userId/confirm-email')
  async confirmProfileEmail(
    @Param('userId') userId: string,
    @Body() body: { code: string },
  ) {
    return this.authService.confirmEmailVerification(userId, body.code);
  }

  @Post('profile/:userId/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: storage,
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadAvatar(
    @Param('userId') userId: string,
    @UploadedFile() file: any,
  ) {
    if (!file) {
      throw new BadRequestException('Avatar image is required');
    }

    // Use Cloudinary URL directly (file.path)
    const avatarUrl = file.path;
    return this.authService.updateProfileAvatar(userId, avatarUrl, avatarUrl);
  }

  @Post('send-verification-code')
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 attempts per minute
  async sendVerificationCode(
    @Body() body: SendVerificationCodeDto,
  ): Promise<{ message: string }> {
    return await this.authService.sendVerificationCode(
      body.email,
      body.forLogin || false,
    );
  }

  @Post('verify-email-code')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 attempts per minute
  async verifyEmailCode(
    @Body() body: VerifyEmailCodeDto,
  ): Promise<{ message: string; verified: boolean }> {
    return await this.authService.verifyEmailCode(body.email, body.code);
  }

  @Post('verify-oauth-code')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 attempts per minute
  async verifyOAuthCode(
    @Body() body: VerifyOAuthCodeDto,
  ): Promise<{ message: string; user: any }> {
    try {
      if (!body.email || !body.code || !body.provider) {
        throw new BadRequestException(
          'Missing required fields: email, code, or provider',
        );
      }

      return await this.authService.verifyOAuthCodeAndRegister(
        body.email,
        body.code,
        body.provider as 'google' | 'facebook',
        body.userInfo || {},
      );
    } catch (error) {
      console.error('Error in verifyOAuthCode:', error);
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to verify OAuth code: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  @Post('google-signin')
  async googleSignIn(@Body() body: GoogleSignInDto) {
    return this.authService.googleSignIn(body.credential);
  }

  @Post('facebook-signin')
  async facebookSignIn(@Body() body: FacebookSignInDto) {
    return this.authService.facebookSignIn(body.accessToken);
  }

  @Get('google')
  googleAuth(@Req() req: Request, @Res() res: Response): void {
    // Redirect to Google OAuth
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback')}&response_type=code&scope=profile email`;
    res.redirect(googleAuthUrl);
  }

  @Get('google/callback')
  async googleCallback(
    @Query('code') code: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const result: {
        email: string;
        provider: string;
        userInfo: any;
      } = await this.authService.handleOAuthCallback('google', code);

      // If user already exists, redirect to login success
      if (
        result.userInfo &&
        typeof result.userInfo === 'object' &&
        'id' in result.userInfo
      ) {
        const redirectUrl = `http://localhost:4200/auth/oauth-success?provider=google&user=${encodeURIComponent(JSON.stringify(result.userInfo))}`;
        res.redirect(redirectUrl);
        return;
      }

      // New user - redirect to verification page
      const redirectUrl = `http://localhost:4200/auth/oauth-verification?provider=google&email=${encodeURIComponent(result.email)}&userInfo=${encodeURIComponent(JSON.stringify(result.userInfo))}`;
      res.redirect(redirectUrl);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const redirectUrl = `http://localhost:4200/auth/oauth-verification?provider=google&success=false&error=${encodeURIComponent(errorMessage)}`;
      res.redirect(redirectUrl);
    }
  }

  @Get('facebook')
  facebookAuth(@Req() req: Request, @Res() res: Response): void {
    // Redirect to Facebook OAuth
    const facebookAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(process.env.FACEBOOK_REDIRECT_URI || 'http://localhost:3000/auth/facebook/callback')}&scope=email`;
    res.redirect(facebookAuthUrl);
  }

  @Get('facebook/callback')
  async facebookCallback(
    @Query('code') code: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const result: {
        email: string;
        provider: string;
        userInfo: any;
      } = await this.authService.handleOAuthCallback('facebook', code);

      // If user already exists, redirect to login success
      if (
        result.userInfo &&
        typeof result.userInfo === 'object' &&
        'id' in result.userInfo
      ) {
        const redirectUrl = `http://localhost:4200/auth/oauth-success?provider=facebook&user=${encodeURIComponent(JSON.stringify(result.userInfo))}`;
        res.redirect(redirectUrl);
        return;
      }

      // New user - redirect to verification page
      const redirectUrl = `http://localhost:4200/auth/oauth-verification?provider=facebook&email=${encodeURIComponent(result.email)}&userInfo=${encodeURIComponent(JSON.stringify(result.userInfo))}`;
      res.redirect(redirectUrl);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const redirectUrl = `http://localhost:4200/auth/oauth-verification?provider=facebook&success=false&error=${encodeURIComponent(errorMessage)}`;
      res.redirect(redirectUrl);
    }
  }

  @Get('twitter')
  twitterAuth(@Req() req: Request, @Res() res: Response): void {
    // Twitter OAuth 1.0a requires different flow
    const twitterAuthUrl = `https://api.twitter.com/oauth/authorize?oauth_token=${process.env.TWITTER_CONSUMER_KEY}`;
    res.redirect(twitterAuthUrl);
  }

  @Get('twitter/callback')
  async twitterCallback(
    @Query('oauth_token') oauthToken: string,
    @Query('oauth_verifier') oauthVerifier: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const user = await this.authService.handleOAuthCallback(
        'twitter',
        oauthVerifier,
      );
      const redirectUrl = `http://localhost:4200/auth/callback?provider=twitter&success=true&user=${encodeURIComponent(JSON.stringify(user))}`;
      res.redirect(redirectUrl);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const redirectUrl = `http://localhost:4200/auth/callback?provider=twitter&success=false&error=${encodeURIComponent(errorMessage)}`;
      res.redirect(redirectUrl);
    }
  }
}
