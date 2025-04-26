import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { MicroservicesConfiguration } from './microservices';
import { BcryptHelper } from './helpers/bcrypt.helper';
import { JwtModule } from '@nestjs/jwt';
import { EnvironmentVariablesConfig } from './config/env.config';

@Module({
  imports: [
    MicroservicesConfiguration,
    EnvironmentVariablesConfig,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, BcryptHelper],
})
export class AppModule {}
