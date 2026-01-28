import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(50, { message: 'Password must not exceed 50 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password!: string;

  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  @MinLength(2, { message: 'First name must be at least 2 characters' })
  @MaxLength(50, { message: 'First name must not exceed 50 characters' })
  @Matches(/^[a-zA-Z\u0600-\u06FF\s]+$/, {
    message: 'First name can only contain letters',
  })
  firstName!: string;

  @IsString({ message: 'Middle name must be a string' })
  @IsNotEmpty({ message: 'Middle name is required' })
  @MaxLength(50, { message: 'Middle name must not exceed 50 characters' })
  middleName!: string;

  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  @MinLength(2, { message: 'Last name must be at least 2 characters' })
  @MaxLength(50, { message: 'Last name must not exceed 50 characters' })
  @Matches(/^[a-zA-Z\u0600-\u06FF\s]+$/, {
    message: 'Last name can only contain letters',
  })
  lastName!: string;

  @IsString({ message: 'Nickname must be a string' })
  @IsNotEmpty({ message: 'Nickname is required' })
  @MinLength(3, { message: 'Nickname must be at least 3 characters' })
  @MaxLength(30, { message: 'Nickname must not exceed 30 characters' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Nickname can only contain letters, numbers, and underscores',
  })
  nickname!: string;

  @IsString({ message: 'Phone must be a string' })
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^(\+20|0)?1[0125]\d{8}$/, {
    message: 'Invalid Egyptian phone number format',
  })
  phone!: string;

  @IsString({ message: 'National ID must be a string' })
  @IsNotEmpty({ message: 'National ID is required' })
  @Matches(/^[23]\d{13}$/, {
    message:
      'Invalid Egyptian National ID format (must be 14 digits starting with 2 or 3)',
  })
  nationalId!: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  password!: string;

  @IsBoolean()
  @IsOptional()
  rememberMe?: boolean;
}

export class SendVerificationCodeDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @IsBoolean()
  @IsOptional()
  forLogin?: boolean;
}

export class VerifyEmailCodeDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @IsString({ message: 'Code must be a string' })
  @IsNotEmpty({ message: 'Verification code is required' })
  @Matches(/^\d{6}$/, { message: 'Verification code must be 6 digits' })
  code!: string;
}

export class VerifyOAuthCodeDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @IsString({ message: 'Code must be a string' })
  @IsNotEmpty({ message: 'Verification code is required' })
  @Matches(/^\d{6}$/, { message: 'Verification code must be 6 digits' })
  code!: string;

  @IsString()
  @IsNotEmpty()
  provider!: string;

  @IsOptional()
  userInfo?: any;
}

export class RefreshTokenDto {
  @IsString({ message: 'Refresh token must be a string' })
  @IsNotEmpty({ message: 'Refresh token is required' })
  refreshToken!: string;
}
