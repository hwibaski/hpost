import { AuthUserId } from '@core/auth/domain/object/auth-user.domain';
import { DraftAuthUser } from '@core/auth/domain/object/draft-auth-user.domain';
import { UserEntity } from '@core/auth/repository/user.entity';
import { UserRepository } from '@core/auth/repository/user.repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@storage/prisma/prisma.service';
import { User } from 'generated/prisma';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(draftAuthUser: DraftAuthUser): Promise<UserEntity> {
    const user = await this.prisma.user.create({
      data: {
        name: draftAuthUser.name,
        email: draftAuthUser.email,
        phoneNumber: draftAuthUser.phoneNumber,
        password: draftAuthUser.password,
      },
    });

    return this.toEntity(user);
  }

  async deleteAll(): Promise<void> {
    await this.prisma.outboundBundle.deleteMany();
    await this.prisma.user.deleteMany();
  }

  async findByPhoneNumberAndEmail(
    phoneNumber: string,
    email: string,
  ): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        phoneNumber,
        email,
      },
    });

    if (!user) {
      return null;
    }

    return this.toEntity(user);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    return this.toEntity(user);
  }

  async findById(id: AuthUserId): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id.value,
      },
    });

    if (!user) {
      return null;
    }

    return this.toEntity(user);
  }

  private toEntity(user: User): UserEntity {
    return UserEntity.of({
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      password: user.password,
    });
  }
}
