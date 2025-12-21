/* eslint-disable @typescript-eslint/require-await */
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './passport/jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
// import { UsersController } from '@/modules/users/users.controller';
// import { UsersModule } from '@/modules/users/users.module';
import { LocalStrategy } from './passport/local.strategy';

@Module({
  imports: [
    // UsersModule,
    PassportModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET') || 'phohoccode',
        signOptions: {
          expiresIn: 60 * 60 * 24,
          algorithms: ['HS256', 'RS256'],
        },
      }),
    }),
  ],

  providers: [AuthService, JwtStrategy, LocalStrategy],
  controllers: [
    // UsersController,
    AuthController,
  ],
  exports: [AuthService],
})
export class AuthModule {}
