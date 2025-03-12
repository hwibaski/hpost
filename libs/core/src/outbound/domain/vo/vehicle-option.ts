import { ValidationFailException } from '@support/exception/service-exception';

export class VehicleOption {
  static readonly BIKE = 'BIKE';
  static readonly CAR = 'CAR';

  constructor(
    readonly type: typeof VehicleOption.BIKE | typeof VehicleOption.CAR,
  ) {
    this.validateType();
  }

  private validateType() {
    if (this.type !== VehicleOption.BIKE && this.type !== VehicleOption.CAR) {
      throw ValidationFailException(
        '차량 옵션은 자전거 또는 차량만 가능합니다.',
      );
    }
  }

  static of(type: typeof VehicleOption.BIKE | typeof VehicleOption.CAR) {
    return new VehicleOption(type);
  }
}
