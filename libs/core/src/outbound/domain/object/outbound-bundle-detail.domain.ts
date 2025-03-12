import { Orderer } from '@core/outbound/domain/object/orderer.domain';
import { OutboundBundleId } from '@core/outbound/domain/object/outbound-bundle.domain';
import { QuickOutboundPackage } from '@core/outbound/domain/object/quick-outbound-package.domain';
import { Channel } from '@core/outbound/domain/vo/channel';

export class OutboundBundleDetail {
  readonly id: OutboundBundleId;
  readonly channel: Channel;
  readonly number: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date | null;
  readonly category: 'quick';
  readonly quickOutboundPackages: QuickOutboundPackage[];
  readonly orderer: Orderer;

  private constructor({
    id,
    channel,
    number,
    createdAt,
    updatedAt,
    deletedAt,
    category,
    quickOutboundPackages,
    orderer,
  }: Pick<
    OutboundBundleDetail,
    | 'id'
    | 'channel'
    | 'number'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt'
    | 'category'
    | 'quickOutboundPackages'
    | 'orderer'
  >) {
    this.id = id;
    this.channel = channel;
    this.number = number;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
    this.category = category;
    this.quickOutboundPackages = quickOutboundPackages;
    this.orderer = orderer;
  }

  static of({
    id,
    channel,
    number,
    createdAt,
    updatedAt,
    deletedAt,
    category,
    quickOutboundPackages,
    orderer,
  }: Pick<
    OutboundBundleDetail,
    | 'id'
    | 'channel'
    | 'number'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt'
    | 'category'
    | 'quickOutboundPackages'
    | 'orderer'
  >) {
    return new OutboundBundleDetail({
      id,
      channel,
      number,
      createdAt,
      updatedAt,
      deletedAt,
      category,
      quickOutboundPackages,
      orderer,
    });
  }
}
