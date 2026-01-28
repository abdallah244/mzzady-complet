import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    // Check for admin authentication header (from Frontend sessionStorage)
    const adminHeader = request.headers['x-admin-authenticated'];
    const adminSession = request.session?.adminId;
    const user = request.user;

    // Allow if admin header is present or session has adminId
    // This is a simple check - يمكن تحسينه لاحقاً بإضافة JWT tokens
    if (adminHeader === 'true' || adminSession || (user && user.isAdmin)) {
      return true;
    }

    throw new UnauthorizedException('Admin access required');
  }
}

