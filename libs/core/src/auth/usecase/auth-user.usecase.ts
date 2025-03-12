import { DraftAuthUser } from '@core/auth/domain/object/draft-auth-user.domain';
import { AuthUserAppender } from '@core/auth/implement/auth-user-appender';
import { AuthUserReader } from '@core/auth/implement/auth-user-reader';
import { PasswordVerifier } from '@core/auth/implement/password-verifier';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ForbiddenException } from '@support/exception/service-exception';

@Injectable()
export class AuthUserUsecase {
  constructor(
    private readonly authUserAppender: AuthUserAppender,
    private readonly authUserReader: AuthUserReader,
    private readonly passwordVerifier: PasswordVerifier,
    private readonly jwtService: JwtService,
  ) {}

  async signup(draftAuthUser: DraftAuthUser) {
    const authUser = await this.authUserAppender.append(draftAuthUser);

    return authUser;
  }

  async login(email: string, password: string) {
    const authUser = await this.authUserReader.findByEmail(email);
    if (!authUser) {
      throw ForbiddenException('유효하지 않은 로그인 시도입니다.');
    }

    const isCorrectPassword = await this.passwordVerifier.verify(
      password,
      authUser.password,
    );
    if (!isCorrectPassword) {
      throw ForbiddenException('유효하지 않은 로그인 시도입니다.');
    }

    const accessToken = await this.jwtService.signAsync({
      userId: authUser.id.value,
      email: authUser.email,
    });

    return accessToken;
  }
}
