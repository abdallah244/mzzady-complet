import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'abdallahhfares@gmail.com',
        pass: process.env.EMAIL_PASSWORD || '', // You'll need to set this in .env
      },
    });
    this.logger.log(
      'EmailService initialized with sender: abdallahhfares@gmail.com',
    );
  }

  async sendVerificationCode(email: string, code: string): Promise<void> {
    const mailOptions = {
      from: 'abdallahhfares@gmail.com',
      to: email,
      subject: 'Mazzady - Email Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #161616; color: #ffffff;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #d4af37; margin: 0;">Mazzady</h1>
          </div>
          <div style="background-color: #1a1a1a; padding: 30px; border-radius: 8px; border: 2px solid #d4af37;">
            <h2 style="color: #d4af37; margin-top: 0;">Email Verification</h2>
            <p style="color: #ffffff; font-size: 16px; line-height: 1.6;">
              Thank you for signing up! Please use the following code to verify your email address:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <div style="display: inline-block; background-color: #d4af37; color: #161616; padding: 15px 30px; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 5px;">
                ${code}
              </div>
            </div>
            <p style="color: #888; font-size: 14px; margin-top: 20px;">
              This code will expire in 10 minutes.
            </p>
            <p style="color: #888; font-size: 14px; margin-top: 10px;">
              If you didn't request this code, please ignore this email.
            </p>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  async sendNotificationEmail(email: string, subject: string, message: string): Promise<void> {
    const mailOptions = {
      from: 'abdallahhfares@gmail.com',
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #161616; color: #ffffff;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #d4af37; margin: 0;">Mazzady</h1>
          </div>
          <div style="background-color: #1a1a1a; padding: 30px; border-radius: 8px; border: 2px solid #d4af37;">
            <h2 style="color: #d4af37; margin-top: 0;">${subject}</h2>
            <p style="color: #ffffff; font-size: 16px; line-height: 1.6;">
              ${message}
            </p>
          </div>
        </div>
      `,
    };

    try {
      this.logger.log(`Sending notification to ${email}: ${subject}`);
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      this.logger.error('Error sending notification email:', error);
    }
  }
}
