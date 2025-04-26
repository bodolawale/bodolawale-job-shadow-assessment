import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptHelper {
  private readonly saltRounds: number;
  constructor() {
    this.saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10');
  }
  compare(password: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(password, hashed);
  }

  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
}
