import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schemas/user.schema';
import {
  EmailVerification,
  EmailVerificationDocument,
} from '../schemas/email-verification.schema';
import { EmailService } from './email.service';

export interface TokenPayload {
  sub: string;
  email: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(EmailVerification.name)
    private emailVerificationModel: Model<EmailVerificationDocument>,
    private emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  async register(
    email: string,
    password: string,
    firstName: string,
    middleName: string,
    lastName: string,
    nickname: string,
    phone: string,
    nationalId: string,
    nationalIdImages: {
      frontUrl: string;
      backUrl: string;
      frontFilename: string;
      backFilename: string;
    },
  ) {
    // Normalize phone number (remove spaces, dashes, and ensure consistent format)
    const normalizedPhone = phone.replace(/\s+/g, '').replace(/-/g, '');
    // Normalize national ID (remove spaces, dashes)
    const normalizedNationalId = nationalId
      .replace(/\s+/g, '')
      .replace(/-/g, '');

    // Validate Egyptian National ID format (14 digits, starting with 2 or 3)
    const egyptianNationalIdRegex = /^[23]\d{13}$/;
    if (!egyptianNationalIdRegex.test(normalizedNationalId)) {
      throw new BadRequestException('Invalid Egyptian National ID format');
    }

    // Check if email is verified
    const verification = await this.emailVerificationModel.findOne({
      email,
      verified: true,
    });
    if (!verification) {
      throw new BadRequestException(
        'Email must be verified before registration',
      );
    }

    const existingUserByEmail = await this.userModel.findOne({ email });
    if (existingUserByEmail) {
      throw new ConflictException('Email already exists');
    }

    const existingUserByNickname = await this.userModel.findOne({ nickname });
    if (existingUserByNickname) {
      throw new ConflictException('Nickname already exists');
    }

    const existingUserByPhone = await this.userModel.findOne({
      phone: normalizedPhone,
    });
    if (existingUserByPhone) {
      throw new ConflictException('Phone number already exists');
    }

    const existingUserByNationalId = await this.userModel.findOne({
      nationalId: normalizedNationalId,
    });
    if (existingUserByNationalId) {
      throw new ConflictException('National ID already exists');
    }

    if (!nationalIdImages?.frontUrl || !nationalIdImages?.backUrl) {
      throw new BadRequestException('National ID images are required');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      email,
      password: hashedPassword,
      firstName,
      middleName,
      lastName,
      nickname,
      phone: normalizedPhone,
      nationalId: normalizedNationalId,
      nationalIdFrontUrl: nationalIdImages.frontUrl,
      nationalIdFrontFilename: nationalIdImages.frontFilename,
      nationalIdBackUrl: nationalIdImages.backUrl,
      nationalIdBackFilename: nationalIdImages.backFilename,
      walletBalance: 80000, // Welcome bonus
    });

    await user.save();
    return {
      message: 'User registered successfully',
      userId: user._id.toString(),
    };
  }

  // Generate JWT tokens
  private generateTokens(user: UserDocument): AuthTokens {
    const payload: TokenPayload = {
      sub: user._id.toString(),
      email: user.email,
    };

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '1d' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  // Refresh access token
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.userModel.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newPayload: TokenPayload = {
        sub: user._id.toString(),
        email: user.email,
      };

      return {
        accessToken: this.jwtService.sign(newPayload, { expiresIn: '1d' }),
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async login(email: string, password: string, rememberMe: boolean = false) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // OAuth users don't have passwords
    if (!user.password) {
      throw new UnauthorizedException('Please login using your social account');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update user activity
    user.isOnline = true;
    user.lastActivity = new Date();
    user.visitsThisMonth = (user.visitsThisMonth || 0) + 1;
    await user.save();

    // Generate JWT tokens
    const tokens = this.generateTokens(user);

    // If rememberMe, extend refresh token expiry
    if (rememberMe) {
      const payload: TokenPayload = {
        sub: user._id.toString(),
        email: user.email,
      };
      tokens.refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });
    }

    return {
      message: 'Login successful',
      ...tokens,
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        nickname: user.nickname,
        phone: user.phone,
      },
    };
  }

  async logout(userId: string) {
    const user = await this.userModel.findById(userId);
    if (user) {
      user.isOnline = false;
      user.lastActivity = new Date();
      await user.save();
    }
    return { message: 'Logout successful' };
  }

  async checkUserExists(email: string) {
    const user = await this.userModel.findOne({ email });
    return { exists: !!user };
  }

  async checkNicknameExists(nickname: string) {
    const user = await this.userModel.findOne({ nickname });
    return { exists: !!user };
  }

  async checkPhoneExists(phone: string) {
    const normalizedPhone = phone.replace(/\s+/g, '').replace(/-/g, '');
    const user = await this.userModel.findOne({ phone: normalizedPhone });
    return { exists: !!user };
  }

  async checkNationalIdExists(nationalId: string) {
    const normalizedNationalId = nationalId
      .replace(/\s+/g, '')
      .replace(/-/g, '');
    const user = await this.userModel.findOne({
      nationalId: normalizedNationalId,
    });
    return { exists: !!user };
  }

  async sendVerificationCode(
    email: string,
    forLogin: boolean = false,
  ): Promise<{ message: string }> {
    // If for login, allow sending code even if user exists
    if (!forLogin) {
      // Check if email already exists (for registration)
      const existingUser = await this.userModel.findOne({ email });
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    } else {
      // For login, check if user exists
      const existingUser = await this.userModel.findOne({ email });
      if (!existingUser) {
        throw new BadRequestException('User not found. Please register first.');
      }
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiration to 10 minutes
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Delete any existing verification for this email
    await this.emailVerificationModel.deleteOne({ email });

    // Create new verification
    const verification = new this.emailVerificationModel({
      email,
      code,
      expiresAt,
      verified: false,
    });

    await verification.save();

    // Send email
    await this.emailService.sendVerificationCode(email, code);

    return { message: 'Verification code sent to email' };
  }

  async verifyEmailCode(
    email: string,
    code: string,
  ): Promise<{ message: string; verified: boolean }> {
    const verification = await this.emailVerificationModel.findOne({ email });

    if (!verification) {
      throw new BadRequestException(
        'No verification code found for this email',
      );
    }

    if (verification.verified) {
      throw new BadRequestException('Email already verified');
    }

    if (new Date() > verification.expiresAt) {
      throw new BadRequestException('Verification code has expired');
    }

    if (verification.code !== code) {
      throw new BadRequestException('Invalid verification code');
    }

    // ✅ Mark as verified
    verification.verified = true;

    // ✅ Delete after 10 minutes from successful verification
    verification.deleteAt = new Date(Date.now() + 10 * 60 * 1000);

    await verification.save();

    this.logger.log(
      `Email verified. Code will be deleted after 10 minutes for: ${email}`,
    );

    return { message: 'Email verified successfully', verified: true };
  }

  async googleSignIn(credential: string): Promise<any> {
    try {
      // Verify the Google ID token
      const ticket = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`,
      );
      const payload = await ticket.json();

      if (payload.error) {
        throw new BadRequestException('Invalid Google token');
      }

      // Verify the audience matches our client ID
      const clientId = process.env.GOOGLE_CLIENT_ID;
      if (payload.aud !== clientId) {
        throw new BadRequestException('Token was not issued for this app');
      }

      const {
        email,
        given_name,
        family_name,
        sub: googleId,
        picture,
      } = payload;

      if (!email) {
        throw new BadRequestException('Google account has no email');
      }

      // Check if user already exists
      let user = await this.userModel.findOne({ email });

      if (user) {
        // Existing user - update OAuth info if needed
        if (!user.oauthId) {
          user.oauthId = googleId;
          user.authProvider = 'google';
        }
        user.isOnline = true;
        user.lastActivity = new Date();
        user.visitsThisMonth = (user.visitsThisMonth || 0) + 1;
        await user.save();
      } else {
        // New user - create account
        const baseNickname = (email.split('@')[0] || 'user')
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '');
        let nickname = baseNickname;
        let counter = 1;
        while (await this.userModel.findOne({ nickname })) {
          nickname = `${baseNickname}${counter}`;
          counter++;
          if (counter > 100) {
            nickname = `${baseNickname}${Date.now()}`;
            break;
          }
        }

        user = new this.userModel({
          email,
          password: '',
          firstName: given_name || 'User',
          middleName: '',
          lastName: family_name || '',
          nickname,
          phone: undefined,
          nationalId: undefined,
          authProvider: 'google',
          oauthId: googleId,
          isProfileComplete: false,
          profileImageUrl: picture || '',
          walletBalance: 80000, // Welcome bonus
        });

        await user.save();
        this.logger.log(`New Google user created: ${email}`);
      }

      // Generate JWT tokens
      const tokens = this.generateTokens(user);

      return {
        message: 'Google sign-in successful',
        ...tokens,
        user: {
          id: user._id.toString(),
          email: user.email,
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          nickname: user.nickname,
          phone: user.phone,
          isProfileComplete: user.isProfileComplete,
          profileImageUrl: user.profileImageUrl,
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Google sign-in failed', error);
      throw new BadRequestException(
        `Google sign-in failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async facebookSignIn(accessToken: string): Promise<any> {
    try {
      // Verify the access token with Facebook and get user info
      const response = await fetch(
        `https://graph.facebook.com/me?fields=id,name,email,first_name,last_name,picture.type(large)&access_token=${accessToken}`,
      );
      const fbUser = await response.json();

      if (fbUser.error) {
        throw new BadRequestException(
          `Facebook token error: ${fbUser.error.message}`,
        );
      }

      // Verify the token belongs to our app
      const debugResponse = await fetch(
        `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`,
      );
      const debugData = await debugResponse.json();

      if (!debugData.data?.is_valid) {
        throw new BadRequestException('Invalid Facebook access token');
      }

      const email = fbUser.email;
      if (!email) {
        throw new BadRequestException(
          'Facebook account has no email. Please allow email permission.',
        );
      }

      // Check if user already exists
      let user = await this.userModel.findOne({ email });

      if (user) {
        if (!user.oauthId) {
          user.oauthId = fbUser.id;
          user.authProvider = 'facebook';
        }
        user.isOnline = true;
        user.lastActivity = new Date();
        user.visitsThisMonth = (user.visitsThisMonth || 0) + 1;
        await user.save();
      } else {
        // New user
        const baseNickname = (email.split('@')[0] || 'user')
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '');
        let nickname = baseNickname;
        let counter = 1;
        while (await this.userModel.findOne({ nickname })) {
          nickname = `${baseNickname}${counter}`;
          counter++;
          if (counter > 100) {
            nickname = `${baseNickname}${Date.now()}`;
            break;
          }
        }

        const pictureUrl = fbUser.picture?.data?.url || '';

        user = new this.userModel({
          email,
          password: '',
          firstName: fbUser.first_name || 'User',
          middleName: '',
          lastName: fbUser.last_name || '',
          nickname,
          phone: undefined,
          nationalId: undefined,
          authProvider: 'facebook',
          oauthId: fbUser.id,
          isProfileComplete: false,
          profileImageUrl: pictureUrl,
          walletBalance: 80000, // Welcome bonus
        });

        await user.save();
        this.logger.log(`New Facebook user created: ${email}`);
      }

      const tokens = this.generateTokens(user);

      return {
        message: 'Facebook sign-in successful',
        ...tokens,
        user: {
          id: user._id.toString(),
          email: user.email,
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          nickname: user.nickname,
          phone: user.phone,
          isProfileComplete: user.isProfileComplete,
          profileImageUrl: user.profileImageUrl,
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Facebook sign-in failed', error);
      throw new BadRequestException(
        `Facebook sign-in failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async handleOAuthCallback(
    provider: 'google' | 'facebook' | 'twitter',
    code: string,
  ): Promise<{ email: string; provider: string; userInfo: any }> {
    // This is a simplified version - in production, you'd exchange the code for tokens
    // and fetch user info from the provider's API

    let userInfo: any;

    try {
      if (provider === 'google') {
        // Exchange code for access token
        const tokenResponse = await fetch(
          'https://oauth2.googleapis.com/token',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              code,
              client_id: process.env.GOOGLE_CLIENT_ID || '',
              client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
              redirect_uri:
                process.env.GOOGLE_REDIRECT_URI ||
                'http://localhost:3000/auth/google/callback',
              grant_type: 'authorization_code',
            }),
          },
        );

        const tokens = await tokenResponse.json();
        if (tokens.error) {
          throw new BadRequestException(
            `Google OAuth error: ${tokens.error_description || tokens.error}`,
          );
        }

        const accessToken = tokens.access_token;

        // Get user info
        const userResponse = await fetch(
          'https://www.googleapis.com/oauth2/v2/userinfo',
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );
        userInfo = await userResponse.json();
      } else if (provider === 'facebook') {
        // Exchange code for access token
        const tokenResponse = await fetch(
          `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&redirect_uri=${encodeURIComponent(process.env.FACEBOOK_REDIRECT_URI || 'http://localhost:3000/auth/facebook/callback')}&code=${code}`,
          {
            method: 'GET',
          },
        );

        const tokens = await tokenResponse.json();
        if (tokens.error) {
          throw new BadRequestException(
            `Facebook OAuth error: ${tokens.error.message || tokens.error}`,
          );
        }

        const accessToken = tokens.access_token;

        // Get user info
        const userResponse = await fetch(
          `https://graph.facebook.com/v18.0/me?fields=id,name,email&access_token=${accessToken}`,
        );
        userInfo = await userResponse.json();

        if (userInfo.error) {
          throw new BadRequestException(
            `Facebook API error: ${userInfo.error.message}`,
          );
        }
      } else if (provider === 'twitter') {
        // Twitter OAuth 1.0a is more complex - this is simplified
        throw new BadRequestException('Twitter OAuth not fully implemented');
      }

      if (!userInfo || !userInfo.email) {
        throw new BadRequestException(
          'Could not retrieve user information from OAuth provider',
        );
      }

      // Check if user already exists - if yes, just login
      const existingUser = await this.userModel.findOne({
        email: userInfo.email,
      });
      if (existingUser) {
        // User exists, return user data for login
        return {
          email: userInfo.email,
          provider,
          userInfo: {
            id: existingUser._id.toString(),
            email: existingUser.email,
            firstName: existingUser.firstName,
            middleName: existingUser.middleName,
            lastName: existingUser.lastName,
            nickname: existingUser.nickname,
            phone: existingUser.phone,
          },
        };
      }

      // User doesn't exist - send verification code (for OAuth registration)
      await this.sendVerificationCode(userInfo.email, false);

      return {
        email: userInfo.email,
        provider,
        userInfo: {
          name: userInfo.name || userInfo.displayName || '',
          email: userInfo.email,
        },
      };
    } catch (error) {
      throw new BadRequestException(
        `OAuth authentication failed: ${(error as Error).message}`,
      );
    }
  }

  async verifyOAuthCodeAndRegister(
    email: string,
    code: string,
    provider: 'google' | 'facebook',
    userInfo: any,
  ): Promise<{ message: string; user: any }> {
    try {
      this.logger.debug(`Verifying OAuth code for ${email} via ${provider}`);

      // Verify the code
      const verification = await this.emailVerificationModel.findOne({ email });

      if (!verification) {
        this.logger.warn(`No verification code found for email: ${email}`);
        throw new BadRequestException(
          'No verification code found for this email',
        );
      }

      if (verification.verified) {
        this.logger.warn(`Email already verified: ${email}`);
        throw new BadRequestException('Email already verified');
      }

      if (new Date() > verification.expiresAt) {
        this.logger.warn(`Verification code expired for: ${email}`);
        throw new BadRequestException('Verification code has expired');
      }

      if (verification.code !== code) {
        this.logger.warn(`Invalid verification code for: ${email}`);
        throw new BadRequestException('Invalid verification code');
      }

      this.logger.debug(`Code verified successfully for: ${email}`);

      // Mark as verified
      verification.verified = true;
      await verification.save();

      // Check if user already exists (shouldn't happen, but just in case)
      let user = await this.userModel.findOne({ email });
      if (user) {
        this.logger.debug(
          `User already exists, returning existing user: ${email}`,
        );
        return {
          message: 'User already exists',
          user: {
            id: user._id.toString(),
            email: user.email,
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,
            nickname: user.nickname,
            phone: user.phone,
          },
        };
      }

      this.logger.log(`Creating new user from OAuth: ${email}`);

      // Create new user from OAuth
      // Handle userInfo safely
      const userName =
        userInfo?.name || userInfo?.displayName || userInfo?.given_name || '';
      const nameParts = userName ? userName.split(' ') : [];
      const firstName = nameParts[0] || userInfo?.given_name || 'User';
      const lastName =
        nameParts.length > 1
          ? nameParts[nameParts.length - 1]
          : userInfo?.family_name || '';
      const middleName =
        nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : '';

      // Generate a unique nickname
      const baseNickname = (email.split('@')[0] || 'user')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
      let nickname = baseNickname;
      let counter = 1;
      while (await this.userModel.findOne({ nickname })) {
        nickname = `${baseNickname}${counter}`;
        counter++;
        if (counter > 100) {
          // Prevent infinite loop
          nickname = `${baseNickname}${Date.now()}`;
          break;
        }
      }

      this.logger.log(`Creating OAuth user: ${email}, nickname: ${nickname}`);

      user = new this.userModel({
        email,
        password: '', // OAuth users don't have passwords
        firstName,
        middleName,
        lastName,
        nickname,
        phone: undefined, // OAuth users might not have phone - will be asked to complete profile
        nationalId: undefined, // OAuth users need to complete profile
        authProvider: provider,
        isProfileComplete: false, // Mark as incomplete for OAuth users
        walletBalance: 80000, // Welcome bonus
      });

      await user.save();

      // Delete verification code after successful OAuth registration
      await this.emailVerificationModel.deleteOne({ email });

      this.logger.log(
        `OAuth user created successfully: ${user._id.toString()}`,
      );

      // Generate JWT tokens for the new OAuth user
      const tokens = this.generateTokens(user);

      return {
        message: 'Account created successfully',
        ...tokens,
        user: {
          id: user._id.toString(),
          email: user.email,
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          nickname: user.nickname,
          phone: user.phone,
          isProfileComplete: user.isProfileComplete,
        },
      };
    } catch (error) {
      this.logger.error('Error in verifyOAuthCodeAndRegister:', error);
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to verify and register: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async getWalletBalance(userId: string): Promise<{ walletBalance: number }> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      walletBalance: user.walletBalance || 0,
    };
  }

  async getProfile(userId: string): Promise<any> {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      nickname: user.nickname,
      phone: user.phone,
      nationalId: user.nationalId,
      profileImageUrl: user.profileImageUrl,
      nationalIdFrontUrl: user.nationalIdFrontUrl,
      nationalIdBackUrl: user.nationalIdBackUrl,
      walletBalance: user.walletBalance || 0,
      authProvider: user.authProvider || 'local',
      isProfileComplete: user.isProfileComplete,
      nicknameChanged: user.nicknameChanged || false,
      emailVerified: user.emailVerified || false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async updateProfile(
    userId: string,
    updates: {
      firstName?: string;
      middleName?: string;
      lastName?: string;
      phone?: string;
      nickname?: string;
      nationalId?: string;
    },
  ): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (updates.firstName) {
      user.firstName = updates.firstName;
    }
    if (updates.middleName !== undefined) {
      user.middleName = updates.middleName;
    }
    if (updates.lastName) {
      user.lastName = updates.lastName;
    }
    if (updates.phone) {
      // Check if phone is already taken by another user
      const existingUser = await this.userModel.findOne({
        phone: updates.phone,
        _id: { $ne: userId },
      });
      if (existingUser) {
        throw new ConflictException('Phone number already in use');
      }
      user.phone = updates.phone;
    }

    // Allow one-time nickname change for OAuth users
    if (updates.nickname && updates.nickname !== user.nickname) {
      if (user.nicknameChanged) {
        throw new BadRequestException('Nickname can only be changed once');
      }
      const existingNickname = await this.userModel.findOne({
        nickname: updates.nickname,
        _id: { $ne: userId },
      });
      if (existingNickname) {
        throw new ConflictException('Nickname already in use');
      }
      user.nickname = updates.nickname;
      user.nicknameChanged = true;
    }

    // Allow OAuth users to add national ID
    if (updates.nationalId && !user.nationalId) {
      const normalizedNationalId = updates.nationalId
        .replace(/\s+/g, '')
        .replace(/-/g, '');
      const egyptianNationalIdRegex = /^[23]\d{13}$/;
      if (!egyptianNationalIdRegex.test(normalizedNationalId)) {
        throw new BadRequestException('Invalid Egyptian National ID format');
      }
      const existingNationalId = await this.userModel.findOne({
        nationalId: normalizedNationalId,
        _id: { $ne: userId },
      });
      if (existingNationalId) {
        throw new ConflictException('National ID already in use');
      }
      user.nationalId = normalizedNationalId;
    }

    // Check if profile is now complete
    if (user.authProvider !== 'local' && !user.isProfileComplete) {
      if (
        user.phone &&
        user.nationalId &&
        user.nationalIdFrontUrl &&
        user.nationalIdBackUrl
      ) {
        user.isProfileComplete = true;
      }
    }

    await user.save();
    return this.getProfile(userId);
  }

  async updateProfileAvatar(
    userId: string,
    avatarUrl: string,
    avatarFilename: string,
  ): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Delete old avatar if exists
    if (user.profileImageFilename) {
      const fs = require('fs');
      const path = require('path');
      const oldAvatarPath = path.join(
        './uploads/profiles',
        user.profileImageFilename,
      );
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    user.profileImageUrl = avatarUrl;
    user.profileImageFilename = avatarFilename;
    await user.save();

    return this.getProfile(userId);
  }

  async uploadNationalIdImages(
    userId: string,
    images: {
      frontUrl: string;
      backUrl: string;
      frontFilename: string;
      backFilename: string;
    },
  ): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Only allow if no national ID images exist yet (one-time upload)
    if (user.nationalIdFrontUrl || user.nationalIdBackUrl) {
      throw new BadRequestException('National ID images already uploaded');
    }

    user.nationalIdFrontUrl = images.frontUrl;
    user.nationalIdFrontFilename = images.frontFilename;
    user.nationalIdBackUrl = images.backUrl;
    user.nationalIdBackFilename = images.backFilename;

    // Check if profile is now complete
    if (user.authProvider !== 'local' && !user.isProfileComplete) {
      if (
        user.phone &&
        user.nationalId &&
        user.nationalIdFrontUrl &&
        user.nationalIdBackUrl
      ) {
        user.isProfileComplete = true;
      }
    }

    await user.save();
    return this.getProfile(userId);
  }

  async markEmailVerified(userId: string): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email already verified');
    }

    // Send verification code
    await this.sendVerificationCode(user.email, true);

    return { message: 'Verification code sent to email' };
  }

  async confirmEmailVerification(userId: string, code: string): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const result = await this.verifyEmailCode(user.email, code);

    if (result.verified) {
      user.emailVerified = true;
      await user.save();
    }

    return { ...result, emailVerified: true };
  }
}
