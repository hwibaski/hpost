import { QuickCharge } from '@core/outbound/domain/object/quick-charge.domain';
import { LocationCoordinate } from '@core/outbound/domain/vo/location';
import { Weight } from '@core/outbound/domain/vo/weight';
import { QuickChargeAppender } from '@core/outbound/implement/quick-charge-appender';
import { QuickChargeCalculator } from '@core/outbound/implement/quick-charge-caculator';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QuickChargeCalculateUsecase {
  constructor(
    private readonly quickChargeAppender: QuickChargeAppender,
    private readonly quickChargeCalculator: QuickChargeCalculator,
  ) {}

  async execute(
    origin: LocationCoordinate,
    destination: LocationCoordinate,
    weight: Weight,
  ): Promise<QuickCharge> {
    const charge = await this.quickChargeCalculator.getCharge(
      origin,
      destination,
      weight,
    );
    const quickCharge = await this.quickChargeAppender.append(charge);

    return quickCharge;
  }
}
