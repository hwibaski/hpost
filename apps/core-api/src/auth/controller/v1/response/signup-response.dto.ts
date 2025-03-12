import { AuthUser } from '@core/auth/domain/object/auth-user.domain';

const SignupResponseTypeSymbol: unique symbol = Symbol('SignupResponseType');

export class SignupResponseDto {
  private readonly [SignupResponseTypeSymbol]: void;

  private constructor(readonly id: string) {}

  static of(authUser: AuthUser): SignupResponseDto {
    return new SignupResponseDto(authUser.id.value);
  }
}
