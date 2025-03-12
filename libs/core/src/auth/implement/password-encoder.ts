import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordEncoder {
  async encode(password: string) {
    return await bcrypt.hash(password, 10);
  }
}
