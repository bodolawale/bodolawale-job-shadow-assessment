import { Inject, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { RegisterDto } from './dto/register';
import { LoginDto } from './dto/login.dto';
import { firstValueFrom, generate } from 'rxjs';
import { BcryptHelper } from 'src/helpers/bcrypt.helper';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    @Inject() private readonly bcryptHelper: BcryptHelper,
    @Inject() private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ user: User; token: string }> {
    const hashedPassword = await this.bcryptHelper.hash(registerDto.password);
    const user = await firstValueFrom(
      this.userServiceClient.send<User>('createUser', {
        ...registerDto,
        password: hashedPassword,
      }),
    );
    const token = await this.jwtService.signAsync(user);
    return { user, token };
  }

  async login(loginDto: LoginDto): Promise<{ user: User; token: string }> {
    const payload = {
      email: loginDto.email,
      tenant_id: loginDto.tenant_id,
    };
    const userFromService = await firstValueFrom(
      this.userServiceClient.send<User & { password: string }>(
        'findUserByEmailForLogin',
        payload,
      ),
    );

    if (!userFromService) throw new RpcException('Invalid Credentials');

    const { password: hashPassword, ...user } = userFromService;
    if (!user) throw new RpcException('Invalid Credentials');
    if (!(await this.bcryptHelper.compare(loginDto.password, hashPassword))) {
      throw new RpcException('Invalid Credentials');
    }

    // generate token
    const token = await this.jwtService.signAsync(user);

    return Promise.resolve({ user, token });
  }

  async verifyToken(token: string): Promise<User> {
    const payload = await this.jwtService.verifyAsync<User>(token);
    return payload;
  }
}
