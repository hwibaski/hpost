import {
  QuickCharge,
  QuickChargeId,
} from '@core/outbound/domain/object/quick-charge.domain';

export class QuickChargeEntity {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date | null;
  readonly baseAmount: number;
  readonly discountAmount: number;
  readonly comsumedAt: Date | null;
  readonly expiredAt: Date | null;

  constructor({
    id,
    createdAt,
    updatedAt,
    deletedAt,
    baseAmount,
    discountAmount,
    comsumedAt,
    expiredAt,
  }: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    baseAmount: number;
    discountAmount: number;
    comsumedAt: Date | null;
    expiredAt: Date | null;
  }) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
    this.baseAmount = baseAmount;
    this.discountAmount = discountAmount;
    this.comsumedAt = comsumedAt;
    this.expiredAt = expiredAt;
  }

  toQuickCharge(): QuickCharge {
    return QuickCharge.of({
      id: QuickChargeId.from(this.id),
      baseAmount: this.baseAmount,
      discountAmount: this.discountAmount,
      comsumedAt: this.comsumedAt,
      expiredAt: this.expiredAt,
    });
  }
}

export abstract class QuickChargeRepository {
  abstract save(quickCharge: QuickCharge): Promise<QuickChargeEntity>;

  abstract findOneById(id: QuickChargeId): Promise<QuickChargeEntity | null>;

  abstract deleteAll(): Promise<void>;
}
