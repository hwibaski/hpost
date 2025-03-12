import { AuthProvider } from '@core/auth/domain/object/auth-provider.domain';
import { Orderer } from '@core/outbound/domain/object/orderer.domain';
import { OutboundBundleDetail } from '@core/outbound/domain/object/outbound-bundle-detail.domain';
import { Channel } from '@core/outbound/domain/vo/channel';
import { QuickOutboundPackageEntity } from '@core/outbound/repository/quick-outbound.repository';
import { DraftOutboundBundle } from '../domain/object/draft-outbound-bundle.domain';
import {
  OutboundBundle,
  OutboundBundleId,
} from '../domain/object/outbound-bundle.domain';
import { Pagination } from '@core/pagination/pagination';

export class OutboundBundleEntity {
  readonly id: string;
  readonly channel: string;
  readonly number: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date;
  readonly category: string;
  readonly userId: string;

  constructor({
    id,
    channel,
    number,
    createdAt,
    updatedAt,
    deletedAt,
    category,
    provider,
  }: {
    id: string;
    channel: string;
    number: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    category: string;
    provider: AuthProvider;
  }) {
    this.id = id;
    this.channel = channel;
    this.number = number;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
    this.category = category;
    this.userId = provider.id.value;
  }

  toOutboundBundle(): OutboundBundle {
    return OutboundBundle.of({
      id: OutboundBundleId.of(this.id),
      channel: Channel.of(this.channel as typeof Channel.PORTAL),
      number: this.number,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      category: this.category as 'quick',
    });
  }

  toOutboundBundleDetail(
    quickOutboundPackageEntityList: QuickOutboundPackageEntity[],
    orderer: Orderer,
  ): OutboundBundleDetail {
    return OutboundBundleDetail.of({
      id: OutboundBundleId.of(this.id),
      channel: Channel.of(this.channel as typeof Channel.PORTAL),
      number: this.number,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      category: this.category as 'quick',
      quickOutboundPackages: quickOutboundPackageEntityList.map(
        (quickOutboundPackageEntity) =>
          quickOutboundPackageEntity.toQuickOutboundPackage(),
      ),
      orderer,
    });
  }
}

export abstract class OutboundBundleRepository {
  abstract save(
    provider: AuthProvider,
    draftOutboundBundle: DraftOutboundBundle,
  ): Promise<OutboundBundleEntity>;

  abstract findByProviderAndId(
    provider: AuthProvider,
    outboundBundleId: OutboundBundleId,
  ): Promise<OutboundBundleEntity>;

  abstract findByProvider(
    provider: AuthProvider,
    pagination: Pagination,
  ): Promise<{ data: OutboundBundleEntity[]; totalCount: number }>;

  abstract deleteAll(): Promise<void>;
}
