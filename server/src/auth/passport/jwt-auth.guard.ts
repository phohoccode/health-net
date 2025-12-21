/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from './public.decorator';
import { JsonWebTokenError } from '@nestjs/jwt/dist';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  // xử lý lỗi trong quá trình xác thực
  handleRequest(err: any, user: any, info: any) {
    // console.log('JWT Auth Guard - handleRequest info:', info?.message);
    // console.log('JWT Auth Guard - handleRequest err:', err);
    // console.log('JWT Auth Guard - handleRequest user:', user);

    const errorMessageMapping: Record<string, string> = {
      'jwt expired': 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!',
      'invalid token': 'Token không hợp lệ, vui lòng đăng nhập lại!',
      'invalid signature': 'Chữ ký token không hợp lệ!',
      'jwt malformed': 'Token bị sai định dạng!',
      'jwt not active': 'Token chưa được kích hoạt!',
      'No auth token': 'Vui lòng cung cấp token xác thực!',
      default: 'Token không hợp lệ, vui lòng đăng nhập lại!',
    };

    // xử lý trường hợp không có token
    if (info instanceof Error) {
      throw new UnauthorizedException({
        message: errorMessageMapping[info.message || 'default'],
      });
    }

    // xử lý trường hợp token không hợp lệ
    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException({
        message: info.message || errorMessageMapping['default'],
      });
    }

    // xử lý các lỗi khác
    if (!user) {
      throw new UnauthorizedException({
        message: errorMessageMapping['default'],
      });
    }

    return user;
  }
}
