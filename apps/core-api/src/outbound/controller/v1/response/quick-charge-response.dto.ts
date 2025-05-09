import { QuickCharge } from '@core/outbound/domain/object/quick-charge.domain';

export class QuickChargeResponseDto {
  readonly id: string;
  readonly baseAmount: number;
  readonly discountAmount: number;
  readonly totalAmount: number;
  readonly expiredAt: Date | null;

  constructor(
    id: string,
    baseAmount: number,
    discountAmount: number,
    expiredAt: Date | null,
  ) {
    this.id = id;
    this.baseAmount = baseAmount;
    this.discountAmount = discountAmount;
    this.totalAmount = baseAmount - discountAmount;
    this.expiredAt = expiredAt;
  }

  static from(quickCharge: QuickCharge): QuickChargeResponseDto {
    return new QuickChargeResponseDto(
      quickCharge.id.value,
      quickCharge.baseAmount,
      quickCharge.discountAmount,
      quickCharge.expiredAt,
    );
  }
}
