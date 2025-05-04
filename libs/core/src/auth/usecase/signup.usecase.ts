import { DraftAuthUser } from '@core/auth/domain/object/draft-auth-user.domain';
import { AuthUserAppender } from '@core/auth/implement/auth-user-appender';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SignupUsecase {
  constructor(private readonly authUserAppender: AuthUserAppender) {}

  async execute(draftAuthUser: DraftAuthUser) {
    const authUser = await this.authUserAppender.append(draftAuthUser);

    return authUser;
  }
}
