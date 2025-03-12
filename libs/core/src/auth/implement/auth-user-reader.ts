import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class AuthUserReader {
  constructor(private readonly userRepository: UserRepository) {}

  async findByEmail(email: string) {
    const rawUser = await this.userRepository.findByEmail(email);

    if (!rawUser) {
      return null;
    }

    return rawUser.toAuthUser();
  }
}
