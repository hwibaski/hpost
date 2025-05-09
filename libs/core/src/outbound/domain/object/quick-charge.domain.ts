import { randomUUID } from 'crypto';

export class QuickChargeId {
  private constructor(readonly value: string) {}

  static from(value: string): QuickChargeId {
    return new QuickChargeId(value);
  }
}

export class QuickCharge {
  readonly id: QuickChargeId;
  readonly baseAmount: number;
  readonly discountAmount: number;
  readonly comsumedAt: Date | null;
  readonly expiredAt: Date | null;

  private constructor({
    id,
    baseAmount,
    discountAmount,
    comsumedAt,
    expiredAt,
  }: Pick<
    QuickCharge,
    'id' | 'baseAmount' | 'discountAmount' | 'comsumedAt' | 'expiredAt'
  >) {
    this.id = id;
    this.baseAmount = baseAmount;
    this.discountAmount = discountAmount;
    this.comsumedAt = comsumedAt;
    this.expiredAt = expiredAt;
  }

  static forDraft({
    baseAmount,
    discountAmount,
    comsumedAt,
  }: Pick<QuickCharge, 'baseAmount' | 'discountAmount' | 'comsumedAt'>) {
    return new QuickCharge({
      id: QuickChargeId.from(randomUUID()),
      baseAmount,
      discountAmount,
      comsumedAt,
      expiredAt: null,
    });
  }

  static of({
    id,
    baseAmount,
    discountAmount,
    comsumedAt,
    expiredAt,
  }: Pick<
    QuickCharge,
    'id' | 'baseAmount' | 'discountAmount' | 'comsumedAt' | 'expiredAt'
  >) {
    return new QuickCharge({
      id,
      baseAmount,
      discountAmount,
      comsumedAt,
      expiredAt,
    });
  }
}
