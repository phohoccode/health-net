/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */

import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
// import { IUser } from '@/modules/users/types/user.type';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', // Sử dụng 'email' thay vì 'username'
      passwordField: 'password',
      passReqToCallback: true, // Cho phép truyền req vào hàm validate
    });
  }

  async validate(req: any, email: string, password: string): Promise<any> {
    // const typeAccount = req.body.type_account;

    // const user = await this.authService.validateUser(
    //   email,
    //   password,
    //   typeAccount,
    // );

    return null; /// test
    // return user;
  }
}
