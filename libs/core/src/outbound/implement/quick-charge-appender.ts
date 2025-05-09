import { QuickCharge } from '@core/outbound/domain/object/quick-charge.domain';
import { QuickChargeRepository } from '@core/outbound/repository/quick-charge.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QuickChargeAppender {
  constructor(private readonly quickChargeRepository: QuickChargeRepository) {}

  async append(charge: number): Promise<QuickCharge> {
    const quickCharge = QuickCharge.forDraft({
      baseAmount: charge,
      discountAmount: 0,
      comsumedAt: null,
    });

    const savedQuickCharge = await this.quickChargeRepository.save(quickCharge);

    return savedQuickCharge.toQuickCharge();
  }
}
