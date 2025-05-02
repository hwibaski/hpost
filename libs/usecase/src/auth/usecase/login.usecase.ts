import { AuthUserReader } from '@core/auth/implement/auth-user-reader';
import { PasswordVerifier } from '@core/auth/implement/password-verifier';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ForbiddenException } from '@support/exception/service-exception';

@Injectable()
export class LoginUsecase {
  constructor(
    private readonly authUserReader: AuthUserReader,
    private readonly passwordVerifier: PasswordVerifier,
    private readonly jwtService: JwtService,
  ) {}

  async execute(email: string, password: string) {
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
