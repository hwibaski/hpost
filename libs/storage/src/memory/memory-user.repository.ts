import { AuthUserId } from '@core/auth/domain/object/auth-user.domain';
import { DraftAuthUser } from '@core/auth/domain/object/draft-auth-user.domain';
import { UserEntity } from '@core/auth/repository/user.entity';
import { UserRepository } from '@core/auth/repository/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MemoryUserRepository implements UserRepository {
  private store: UserEntity[] = [];
  private idCounter = 1;

  async save(draftAuthUser: DraftAuthUser): Promise<UserEntity> {
    const userEntity = UserEntity.of({
      id: this.idCounter.toString(),
      name: draftAuthUser.name,
      email: draftAuthUser.email,
      phoneNumber: draftAuthUser.phoneNumber,
      password: draftAuthUser.password,
    });

    this.store.push(userEntity);
    this.idCounter++;

    return userEntity;
  }

  async deleteAll(): Promise<void> {
    this.store = [];
  }

  async findByPhoneNumberAndEmail(
    phoneNumber: string,
    email: string,
  ): Promise<UserEntity | null> {
    const userEntity = this.store.find(
      (userEntity) =>
        userEntity.phoneNumber === phoneNumber && userEntity.email === email,
    );

    if (!userEntity) {
      return null;
    }

    return userEntity;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const userEntity = this.store.find(
      (userEntity) => userEntity.email === email,
    );

    if (!userEntity) {
      return null;
    }

    return userEntity;
  }

  async findById(id: AuthUserId): Promise<UserEntity | null> {
    const userEntity = this.store.find(
      (userEntity) => userEntity.id === id.value,
    );

    if (!userEntity) {
      return null;
    }

    return userEntity;
  }
}
