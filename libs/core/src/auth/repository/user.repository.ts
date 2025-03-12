import { AuthUserId } from '@core/auth/domain/object/auth-user.domain';
import { DraftAuthUser } from '@core/auth/domain/object/draft-auth-user.domain';
import { UserEntity } from '@core/auth/repository/user.entity';

export abstract class UserRepository {
  abstract findByPhoneNumberAndEmail(
    phoneNumber: string,
    email: string,
  ): Promise<UserEntity | null>;

  abstract save(draftAuthUser: DraftAuthUser): Promise<UserEntity>;

  abstract deleteAll(): Promise<void>;

  abstract findByEmail(email: string): Promise<UserEntity | null>;

  abstract findById(id: AuthUserId): Promise<UserEntity | null>;
}
