/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
// import { IUser, TypeAccount } from './../modules/users/types/user.type';
// import { UsersService } from '@/modules/users/users.service';
// import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly clientUrl: string | null = null;
  private readonly expiresInAccessToken: number | string = 60 * 15; // 15 phút
  private readonly expiresInRefreshToken: number | string = 60 * 60 * 24 * 7; // 7 ngày
  private readonly apiVersion: string = 'v1';

  constructor(
    private jwtService: JwtService,
    // private usersService: UsersService,
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {
    this.clientUrl = this.configService.get<string>('CLIENT_URL') || null;
    this.apiVersion = this.configService.get<string>('API_VERSION') || 'v1';
  }

//   generateToken(
//     payload: Record<string, any>,
//     expiresIn?: string | number,
//   ): string {
//     try {
//       return this.jwtService.sign(payload, {
//         ...(expiresIn ? { expiresIn } : {}),
//       });
//     } catch (error) {
//       console.log('>>> Error generating token:', error);
//       throw new InternalServerErrorException('Lỗi tạo token');
//     }
//   }

//   verifyToken(token: string): Record<string, any> | null {
//     try {
//       return this.jwtService.verify(token);
//     } catch (error) {
//       console.log('>>> Error verifying token:', error);
//       return null;
//     }
//   }

  //   async validateUser(
  //     email: string,
  //     pass: string,
  //     typeAccount: TypeAccount,
  //   ): Promise<any> {
  //     try {
  //       const user = await this.usersService.findUserByEmailAndTypeAccount(
  //         email,
  //         typeAccount,
  //       );

  //       const isCorrectPassword = bcrypt.compareSync(pass, user?.password || '');

  //       if (!user || !isCorrectPassword) {
  //         throw new UnauthorizedException('Tài khoản hoặc mật khẩu không đúng');
  //       }

  //       if (user.status === 'pending') {
  //         throw new UnauthorizedException({
  //           status: false,
  //           message: 'Tài khoản chưa được kích hoạt',
  //           error: 'Unauthorized',
  //         });
  //       }

  //       if (user.status === 'banned') {
  //         throw new UnauthorizedException({
  //           status: false,
  //           message: 'Tài khoản đã bị khóa',
  //           error: 'Unauthorized',
  //         });
  //       }

  //       const { password, ...result } = user;

  //       return result;
  //     } catch (error) {
  //       console.log('>>> check error validateUser', error);
  //       if (error instanceof UnauthorizedException) {
  //         throw error;
  //       }

  //       throw new InternalServerErrorException('Lỗi xác thực người dùng');
  //     }
  //   }

  //   generateTokens(user: IUser) {
  //     const payloadAccessToken = {
  //       email: user.email,
  //       password: user.password,
  //       type_account: user.type_account,
  //       user_id: user.user_id,
  //       role: user.role,
  //       status: user.status,
  //       username: user.username,
  //       avatar: user.avatar,
  //       gender: user.gender,
  //     };

  //     const payloadRefreshToken = {
  //       user_id: user.user_id,
  //     };

  //     const accessToken = this.generateToken(
  //       payloadAccessToken,
  //       this.expiresInAccessToken,
  //     );

  //     const refreshToken = this.generateToken(
  //       payloadRefreshToken,
  //       this.expiresInRefreshToken,
  //     );

  //     return { accessToken, refreshToken };
  //   }

  //   // user được truyền từ passport sau khi xác thực thành công
  //   async login(user: IUser) {
  //     const { accessToken, refreshToken } = this.generateTokens(user);

  //     return {
  //       status: true,
  //       message: 'Đăng nhập thành công',
  //       result: {
  //         user,
  //         access_token: accessToken,
  //         refresh_token: refreshToken,
  //       },
  //     };
  //   }

  //   async register(user: RegisterDto) {
  //     try {
  //       const { email, type_account, username, avatar } = user;

  //       const existingUser =
  //         await this.usersService.findUserByEmailAndTypeAccount(
  //           email,
  //           type_account,
  //         );

  //       // nếu user đã tồn tại và đang ở trạng thái active
  //       if (existingUser && existingUser.status === 'active') {
  //         throw new ConflictException('Email đã được sử dụng!');
  //       }

  //       const userId = existingUser?.user_id || uuidv4();
  //       const data = { email, username, avatar, type_account, user_id: userId };
  //       const token = this.generateToken(data);

  //       // Gửi email xác nhận nếu là tài khoản credentials
  //       if (user.type_account === 'credentials') {
  //         await this.mailerService.sendMail({
  //           to: email,
  //           from: "'Phoflix' <phohoccode@gmail.com>",
  //           subject: 'Xác nhận đăng ký tài khoản Phoflix',
  //           template: 'register',
  //           context: {
  //             username,
  //             link: `http://localhost:8000/auth/verify-token?action=register&token=${token}`,
  //             // link: `${this.clientUrl}/api/${this.apiVersion}/auth/verify-token?action=register&token=${token}`,
  //           },
  //         });
  //       }

  //       let newUser: IUser | null = null;

  //       if (!existingUser) {
  //         newUser = await this.usersService.createUser({
  //           user_id: userId,
  //           status: user.type_account === 'credentials' ? 'pending' : 'active',
  //           ...user,
  //         });
  //       }

  //       return {
  //         status: true,
  //         message:
  //           user.type_account === 'credentials'
  //             ? 'Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.'
  //             : 'Đăng ký thành công!',
  //         result: {
  //           user: {
  //             user_id: newUser?.user_id || existingUser?.user_id,
  //             email: newUser?.email || existingUser?.email,
  //           },
  //           token,
  //         },
  //       };
  //     } catch (error) {
  //       console.log('>>> check error register', error);
  //       if (error instanceof ConflictException) {
  //         throw error;
  //       }

  //       throw new InternalServerErrorException('Không thể đăng ký tài khoản');
  //     }
  //   }

  //   async completeRegistration(token: string) {
  //     try {
  //       const decoded = this.verifyToken(token);

  //       if (!decoded) {
  //         throw new UnauthorizedException('Token không hợp lệ');
  //       }

  //       const user = await this.usersService.updateStatusUser(
  //         decoded?.user_id,
  //         'active',
  //       );

  //       return {
  //         status: true,
  //         message: 'Kích hoạt tài khoản thành công!',
  //         result: {
  //           user,
  //         },
  //       };
  //     } catch (error) {
  //       console.log('>>> check error completeRegistration', error);
  //       if (error instanceof UnauthorizedException) {
  //         throw error;
  //       }

  //       throw new InternalServerErrorException('Không thể hoàn tất đăng ký');
  //     }
  //   }

  //   async forgotPassword(email: string, typeAccount: 'credentials') {
  //     try {
  //       const user = await this.usersService.findUserByEmailAndTypeAccount(
  //         email,
  //         typeAccount,
  //       );

  //       if (!user) {
  //         throw new UnauthorizedException('Email không tồn tại');
  //       }

  //       const data = {
  //         email: user.email,
  //         type_account: user.type_account,
  //         user_id: user.user_id,
  //       };

  //       const token = this.generateToken(data);

  //       // Gửi email xác nhận nếu là tài khoản credentials
  //       await this.mailerService.sendMail({
  //         to: email,
  //         from: "'Phoflix' <phohoccode@gmail.com>",
  //         subject: 'Khôi phục mật khẩu tài khoản Phoflix',
  //         template: 'forgot-password',
  //         context: {
  //           username: user.username,
  //           link: `http://localhost:8000/auth/verify-token?action=forgot-password&token=${token}`,
  //           // link: `${this.clientUrl}/api/${this.apiVersion}/auth/verify-token?action=forgot-password&token=${token}`,
  //         },
  //       });

  //       return {
  //         status: true,
  //         message: 'Vui lòng kiểm tra email để lấy liên kết đặt lại mật khẩu.',
  //       };
  //     } catch (error) {
  //       console.log('>>> check error forgotPassword', error);
  //       if (error instanceof UnauthorizedException) {
  //         throw error;
  //       }

  //       throw new InternalServerErrorException('Lỗi hệ thống');
  //     }
  //   }

  //   async resetPassword(userId: string, newPassword: string) {
  //     try {
  //       const userUpdated = await this.usersService.updatePasswordUser(
  //         userId,
  //         newPassword,
  //       );

  //       if (!userUpdated) {
  //         throw new NotFoundException('Cập nhật mật khẩu không thành công');
  //       }

  //       return {
  //         status: true,
  //         message: 'Cập nhật mật khẩu thành công',
  //         result: {
  //           user: userUpdated,
  //         },
  //       };
  //     } catch (error) {
  //       console.log('>>> check error resetPassword', error);
  //       if (error instanceof NotFoundException) {
  //         throw error;
  //       }

  //       throw new InternalServerErrorException(
  //         'Lỗi hệ thống. Vui lòng thử lại sau',
  //       );
  //     }
  //   }

  //   async refreshToken(refreshToken: string) {
  //     try {
  //       const decoded = this.verifyToken(refreshToken);

  //       if (!decoded) {
  //         throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
  //       }

  //       const user = await this.usersService.findUserById(decoded.user_id);

  //       if (!user) {
  //         throw new NotFoundException('Người dùng không tồn tại');
  //       }

  //       const { accessToken, refreshToken: newRefreshToken } =
  //         this.generateTokens(user);

  //       return {
  //         status: true,
  //         message: 'Làm mới token thành công',
  //         result: {
  //           user,
  //           access_token: accessToken,
  //           refresh_token: newRefreshToken,
  //         },
  //       };
  //     } catch (error) {
  //       console.log('>>> check error refreshToken', error);
  //       throw new InternalServerErrorException(
  //         'Lỗi hệ thống. Vui lòng thử lại sau',
  //       );
  //     }
  //   }
}
