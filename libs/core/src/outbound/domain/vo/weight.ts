import { ValidationFailException } from '@support/exception/service-exception';

export class Weight {
  readonly value: number;

  private constructor(value: number) {
    this.validateProps(value);
    this.value = value;
  }

  static of(value: number) {
    return new Weight(value);
  }

  private validateProps(value: number) {
    if (value === null || value === undefined) {
      throw ValidationFailException('무게는 필수 입력값입니다.');
    }
    if (value < 0) {
      throw ValidationFailException('무게는 0보다 크거나 같아야 합니다.');
    }

    if (value > 100) {
      throw ValidationFailException('무게는 100kg 이하여야 합니다.');
    }
  }
}
