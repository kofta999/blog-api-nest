import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpErrorFilter } from './shared/filters/http-error.filter';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';
import * as cookieParser from 'cookie-parser';
import keys from './config/keys';
import { readFileSync } from 'fs';

async function bootstrap() {
  const httpsOptions = {
    key: readFileSync('./src/cert/key.pem'),
    cert: readFileSync('./src/cert/cert.pem'),
  };

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
    cors: {
      credentials: true,
      origin: 'http://localhost:5173',
    },
  });
  app.useGlobalFilters(new HttpErrorFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.use(cookieParser(keys.cookieConfig.secret));
  await app.listen(3000);
}
bootstrap();
