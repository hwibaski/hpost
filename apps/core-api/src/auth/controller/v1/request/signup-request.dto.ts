import { DraftAuthUser } from '@core/auth/domain/object/draft-auth-user.domain';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignupRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  toDraftAuthUser(): DraftAuthUser {
    return DraftAuthUser.of({
      name: this.name,
      email: this.email,
      phoneNumber: this.phoneNumber,
      password: this.password,
    });
  }
}
