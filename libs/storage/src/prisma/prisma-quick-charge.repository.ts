import {
  QuickCharge,
  QuickChargeId,
} from '@core/outbound/domain/object/quick-charge.domain';
import {
  QuickChargeEntity,
  QuickChargeRepository,
} from '@core/outbound/repository/quick-charge.repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@storage/prisma/prisma.service';
import { QuickCharge as PrismaQuickCharge } from 'generated/prisma';

@Injectable()
export class PrismaQuickChargeRepository implements QuickChargeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(quickCharge: QuickCharge): Promise<QuickChargeEntity> {
    const entity = new QuickChargeEntity({
      id: quickCharge.id.value,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      baseAmount: quickCharge.baseAmount,
      discountAmount: quickCharge.discountAmount,
      comsumedAt: quickCharge.comsumedAt,
      expiredAt: quickCharge.expiredAt,
    });

    const prismaQuickCharge = await this.prisma.quickCharge.create({
      data: {
        id: entity.id,
        baseAmount: entity.baseAmount,
        discountAmount: entity.discountAmount,
      },
    });

    return this.toEntity(prismaQuickCharge);
  }

  async findOneById(id: QuickChargeId): Promise<QuickChargeEntity | null> {
    const entity = await this.prisma.quickCharge.findUnique({
      where: { id: id.value },
    });

    if (!entity) {
      return null;
    }

    return this.toEntity(entity);
  }

  async deleteAll(): Promise<void> {
    await this.prisma.quickCharge.deleteMany();
  }

  private toEntity(prismaQuickCharge: PrismaQuickCharge): QuickChargeEntity {
    return new QuickChargeEntity({
      id: prismaQuickCharge.id,
      createdAt: prismaQuickCharge.createdAt,
      updatedAt: prismaQuickCharge.updatedAt,
      deletedAt: prismaQuickCharge.deletedAt,
      baseAmount: prismaQuickCharge.baseAmount,
      discountAmount: prismaQuickCharge.discountAmount,
      comsumedAt: prismaQuickCharge.comsumedAt,
      expiredAt: prismaQuickCharge.expiredAt,
    });
  }
}
