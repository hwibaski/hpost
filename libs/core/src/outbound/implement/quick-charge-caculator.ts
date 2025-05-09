import { LocationCoordinate } from '@core/outbound/domain/vo/location';
import { Weight } from '@core/outbound/domain/vo/weight';
import { Injectable } from '@nestjs/common';

export abstract class QuickChargeCalculator {
  abstract getCharge(
    origin: LocationCoordinate,
    destination: LocationCoordinate,
    weight: Weight,
  ): Promise<number>;
}

@Injectable()
export class RandomBasedQuickChargeCalculator extends QuickChargeCalculator {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getCharge(
    origin: LocationCoordinate,
    destination: LocationCoordinate,
    weight: Weight,
  ) {
    const MIN_CHARGE = 5000;
    const MAX_CHARGE = 50000;
    const range = MAX_CHARGE - MIN_CHARGE;
    const random = Math.floor(Math.random() * range) + MIN_CHARGE;
    const weightedCharge = random * (1 + weight.value / 100); // weight가 퍼센트 단위로 적용됨
    return Math.floor(weightedCharge);
  }
}
