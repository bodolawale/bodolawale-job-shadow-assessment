import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './all-exception.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptors';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: 'TCP',
    options: {
      host: '127.0.0.1',
      port: 3002,
    },
  });

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  await app.listen();
}
void bootstrap();
