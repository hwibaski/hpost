import { ValidationFailException } from '@support/exception/service-exception';

export class Channel {
  static readonly PORTAL = 'PORTAL';

  private constructor(readonly value: typeof Channel.PORTAL) {
    this.validateValue(value);
  }

  static of(value: typeof Channel.PORTAL) {
    return new Channel(value);
  }

  private validateValue(value: typeof Channel.PORTAL) {
    if (value !== Channel.PORTAL) {
      throw ValidationFailException('채널은 포탈만 가능합니다.');
    }
  }
}
