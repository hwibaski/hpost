import { UserRepository } from '@core/auth/repository/user.repository';
import { Injectable } from '@nestjs/common';
import { DuplicateEntityException } from '@support/exception/service-exception';

@Injectable()
export class AuthUserDuplicateChecker {
  constructor(private readonly userRepository: UserRepository) {}

  async checkByPhoneNumberAndEmail(phoneNumber: string, email: string) {
    const userEntity = await this.userRepository.findByPhoneNumberAndEmail(
      phoneNumber,
      email,
    );

    if (userEntity) {
      throw DuplicateEntityException('이미 가입된 회원입니다.');
    }
  }
}
