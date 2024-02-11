import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpErrorFilter } from './shared/filters/http-error.filter';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';
import * as cookieParser from 'cookie-parser';
import keys from './config/keys';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpErrorFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.use(cookieParser(keys.cookieConfig.secret));
  await app.listen(3000);
}
bootstrap();
