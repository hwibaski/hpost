import { Channel } from '@core/outbound/domain/vo/channel';

export class OutboundBundleId {
  private constructor(readonly value: string) {}

  static of(value: string): OutboundBundleId {
    return new OutboundBundleId(value);
  }
}

export class OutboundBundle {
  readonly id: OutboundBundleId;
  readonly channel: Channel;
  readonly number: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date | null;
  readonly category: 'quick';

  private constructor({
    id,
    channel,
    number,
    createdAt,
    updatedAt,
    deletedAt,
    category,
  }: Pick<
    OutboundBundle,
    | 'id'
    | 'channel'
    | 'number'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt'
    | 'category'
  >) {
    this.id = id;
    this.channel = channel;
    this.number = number;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
    this.category = category;
  }

  static of({
    id,
    channel,
    number,
    createdAt,
    updatedAt,
    deletedAt,
    category,
  }: Pick<
    OutboundBundle,
    | 'id'
    | 'channel'
    | 'number'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt'
    | 'category'
  >) {
    return new OutboundBundle({
      id,
      channel,
      number,
      createdAt,
      updatedAt,
      deletedAt,
      category,
    });
  }
}
