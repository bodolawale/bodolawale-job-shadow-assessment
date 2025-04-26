import { ClientsModule, Transport } from '@nestjs/microservices';

export const MicroservicesConfiguration = ClientsModule.register([
  {
    name: 'AUTH_SERVICE',
    transport: Transport.TCP,
    options: { host: '127.0.0.1', port: 3001 },
  },
  {
    name: 'USER_SERVICE',
    transport: Transport.TCP,
    options: { host: '127.0.0.1', port: 3002 },
  },
]);
