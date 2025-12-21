import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT') || 8080;
  const corsOrigins = configService.get<string>('CORS_ORIGINS')?.split(',') || [
    '*',
  ];
  const apiVersion = configService.get<string>('API_VERSION') || 'v1';

  // config cors: cho phép các yêu cầu từ các nguồn khác nhau
  app.enableCors({
    origin: corsOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  // config compression: nén phản hồi HTTP để giảm kích thước dữ liệu truyền qua mạng
  app.use(
    compression({
      threshold: 1024, // nén các phản hồi có kích thước lớn hơn 1KB
      level: 6, // mức độ nén từ 0 đến 9 (mặc định là 6)
      filter: (req, res) => {
        if (req.headers['x-no-compression']) {
          return false;
        }
        return compression.filter(req, res); // sử dụng bộ lọc mặc định
      },
    }),
  );

  // config throw error: xử lý ngoại lệ toàn cục
  // app.useGlobalFilters(new HttpExceptionFilter());

  // config interceptors: chuẩn hóa phản hồi API
  // app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));

  // config validation pipe: tự động kiểm tra và chuyển đổi dữ liệu đầu vào
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // loại bỏ các thuộc tính không được định nghĩa trong DTO
      transform: true, // tự động chuyển đổi kiểu dữ liệu
      transformOptions: {
        enableImplicitConversion: true, // chuyển đổi kiểu dữ liệu tự động
      },

      // custom error message
      exceptionFactory(errors) {
        if (!errors || errors.length === 0) return;

        const messages = errors.flatMap((err) =>
          Object.values(err.constraints ?? {}),
        );

        const firstErrorMessage = messages[0] || 'Dữ liệu không hợp lệ!';
        return new BadRequestException({
          status: false,
          message: firstErrorMessage,
        });
      },
    }),
  );

  await app.listen(port);
}

void bootstrap();
