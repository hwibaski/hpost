import { Channel } from '@core/outbound/domain/vo/channel';
import { randomUUID } from 'crypto';

export class DraftOutboundBundle {
  readonly channel: Channel;
  readonly number: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date | null;
  readonly category: 'quick';

  private constructor() {
    this.channel = Channel.of(Channel.PORTAL);
    this.number = randomUUID();
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.deletedAt = null;
    this.category = 'quick';
  }

  static of(): DraftOutboundBundle {
    return new DraftOutboundBundle();
  }
}
