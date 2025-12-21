/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
import { JwtService } from '@nestjs/jwt';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { getGooglePublicKey } from '@/helpers/utils';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // không bỏ qua thời gian hết hạn
      algorithms: ['HS256', 'RS256'], // cấu hình thuật toán HS256
      passReqToCallback: true, // cho phép truyền request vào validate
      secretOrKeyProvider: (request, rawJwtToken, done) => {
        try {
          const decodedHeader = JSON.parse(
            Buffer.from(rawJwtToken.split('.')[0], 'base64').toString(),
          );
          const JWT_SECRET = this.configService.get<string>('JWT_SECRET');

          const { alg, kid } = decodedHeader as { alg: string; kid?: string };

          switch (alg) {
            // xử lý thuật toán mặc định từ client
            case 'HS256':
              return done(null, JWT_SECRET);

            // xử lý thuật toán từ Google OAuth
            case 'RS256': {
              if (!kid) {
                return done(new Error('Missing kid in JWT header'), undefined);
              }

              //   getGooglePublicKey(kid)
              //     .then((pem) => {
              //       return done(null, pem);
              //     })
              //     .catch((error) => {
              //       console.log('Error reading public key:', error);
              //       return done(error, undefined);
              //     });
              break;
            }

            default: {
              return done(new Error('Unsupported JWT algorithm'), undefined);
            }
          }
        } catch (error) {
          console.log('Error reading public key:', error);
          return done(error, undefined);
        }
      },
    });
  }

  async validate(req: Request, payload: any) {
    return payload;
  }
}
