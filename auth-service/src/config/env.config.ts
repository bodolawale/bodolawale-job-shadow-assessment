import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';

export const EnvironmentVariablesConfig = ConfigModule.forRoot({
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test', 'provision')
      .default('development'),
    JWT_SECRET: Joi.string().default('some-jwt-secret'),
  }),
  validationOptions: {
    abortEarly: true,
  },
});
