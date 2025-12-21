/* eslint-disable @typescript-eslint/require-await */
import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './passport/public.decorator';
import { LocalAuthGuard } from './passport/local-auth.guard';
// import { IUser } from '@/modules/users/types/user.type';
// import { UsersService } from '@/modules/users/users.service';
// import { RegisterDto } from './dto/register.dto';
// import { ForgotPasswordDto } from './dto/forgot-password.dto';
// import { ResetPasswordDto } from './dto/reset-password.dto';
// import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    // private readonly userService: UsersService,
  ) {}

  /**
   *
   * @param req nhận được từ passport sau khi xác thực thành công
   * @returns trả về thông tin user và token
   */

  //   @UseGuards(LocalAuthGuard)
  //   @Public()
  //   @Post('login')
  //   async login(@Request() req: { user: any }) {
  //     return await this.authService.login(req.user);
  //   }

  //   @Get('profile')
  //   getProfile(@Request() req: { user: IUser }) {
  //     return req.user;
  //   }

  //   @Public()
  //   @Post('register')
  //   async register(@Body() body: RegisterDto) {
  //     return await this.authService.register(body);
  //   }

  //   @Public()
  //   @Get('complete-registration')
  //   async completeRegistration(@Query('token') token: string) {
  //     return await this.authService.completeRegistration(token);
  //   }

  //   @Public()
  //   @Post('forgot-password')
  //   async forgotPassword(@Body() body: ForgotPasswordDto) {
  //     return await this.authService.forgotPassword(body.email, body.type_account);
  //   }

  //   @Public()
  //   @Get('verify-token')
  //   async verifyToken(@Query() query: { token: string }) {
  //     const decoded = this.authService.verifyToken(query.token);

  //     if (!decoded) {
  //       return { status: false, message: 'Token không hợp lệ hoặc đã hết hạn' };
  //     }

  //     return {
  //       status: true,
  //       message: 'Xác thực token thành công',
  //       result: {
  //         user: decoded,
  //       },
  //     };
  //   }

  //   @Post('reset-password')
  //   async resetPassword(
  //     @Request() req: { user: IUser },
  //     @Body() body: ResetPasswordDto,
  //   ) {
  //     return this.authService.resetPassword(req.user.user_id, body.new_password);
  //   }

  //   @Post('refresh-token')
  //   @Public()
  //   refreshToken(@Body() body: RefreshTokenDto) {
  //     return this.authService.refreshToken(body.refresh_token);
  //   }
}
