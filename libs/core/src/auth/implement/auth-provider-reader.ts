import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class AuthProviderReader {
  constructor(private readonly userRepository: UserRepository) {}

  async findByEmail(email: string) {
    const userEntity = await this.userRepository.findByEmail(email);

    if (!userEntity) {
      return null;
    }

    return userEntity.toAuthProvider();
  }
}
