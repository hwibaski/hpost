import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';

@Injectable()
export class PasswordEncoder {
  async encode(password: string) {
    return await bcrypt.hash(password, 10);
  }
}
