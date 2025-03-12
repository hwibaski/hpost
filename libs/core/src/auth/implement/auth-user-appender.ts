import { DraftAuthUser } from '@core/auth/domain/object/draft-auth-user.domain';
import { AuthUserDuplicateChecker } from '@core/auth/implement/auth-user-duplicate-checker';
import { AuthUserValidator } from '@core/auth/implement/auth-user-validator';
import { PasswordEncoder } from '@core/auth/implement/password-encoder';
import { UserRepository } from '@core/auth/repository/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthUserAppender {
  constructor(
    private readonly authUserRepository: UserRepository,
    private readonly authUserValidator: AuthUserValidator,
    private readonly authUserDuplicationChecker: AuthUserDuplicateChecker,
    private readonly passwordEncoder: PasswordEncoder,
  ) {}

  async append(draftAuthUser: DraftAuthUser) {
    this.authUserValidator.validate(draftAuthUser);
    await this.authUserDuplicationChecker.checkByPhoneNumberAndEmail(
      draftAuthUser.phoneNumber,
      draftAuthUser.email,
    );

    const encodedPassword = await this.passwordEncoder.encode(
      draftAuthUser.password,
    );

    draftAuthUser.setPassword(encodedPassword);

    const rawUser = await this.authUserRepository.save(draftAuthUser);

    return rawUser.toAuthUser();
  }
}
