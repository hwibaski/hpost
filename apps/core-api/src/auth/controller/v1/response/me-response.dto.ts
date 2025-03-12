import { AuthProvider } from '@core/auth/domain/object/auth-provider.domain';

export class MeResponseDto {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly phoneNumber: string;

  private constructor(authUser: AuthProvider) {
    this.id = authUser.id.value;
    this.email = authUser.email;
    this.name = authUser.name;
    this.phoneNumber = authUser.phoneNumber;
  }

  static of(authUser: AuthProvider) {
    return new MeResponseDto(authUser);
  }
}
