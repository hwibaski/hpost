import {
  QuickCharge,
  QuickChargeId,
} from '@core/outbound/domain/object/quick-charge.domain';
import {
  QuickChargeEntity,
  QuickChargeRepository,
} from '@core/outbound/repository/quick-charge.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MemoryQuickChargeRepository extends QuickChargeRepository {
  private readonly quickCharges: Map<string, QuickChargeEntity> = new Map();

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

    this.quickCharges.set(entity.id, entity);
    return entity;
  }

  async findOneById(id: QuickChargeId): Promise<QuickChargeEntity | null> {
    const entity = this.quickCharges.get(id.value);
    return entity ?? null;
  }

  async deleteAll(): Promise<void> {
    this.quickCharges.clear();
  }
}
