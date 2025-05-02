import { AuthProvider } from '@core/auth/domain/object/auth-provider.domain';
import { DraftOutboundBundle } from '@core/outbound/domain/object/draft-outbound-bundle.domain';
import { OutboundBundleId } from '@core/outbound/domain/object/outbound-bundle.domain';
import {
  OutboundBundleEntity,
  OutboundBundleRepository,
} from '@core/outbound/repository/outbound-bundle.repository';
import { Pagination } from '@core/pagination/pagination';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MemoryOutboundBundleRepository
  implements OutboundBundleRepository
{
  private store: OutboundBundleEntity[] = [];
  private idCounter = 1;

  async save(
    provider: AuthProvider,
    draftOutboundBundle: DraftOutboundBundle,
  ): Promise<OutboundBundleEntity> {
    const outboundBundleEntity = new OutboundBundleEntity({
      id: this.idCounter.toString(),
      channel: draftOutboundBundle.channel.value,
      number: draftOutboundBundle.number,
      createdAt: draftOutboundBundle.createdAt,
      updatedAt: draftOutboundBundle.updatedAt,
      deletedAt: draftOutboundBundle.deletedAt,
      category: draftOutboundBundle.category,
      provider,
    });

    this.store.push(outboundBundleEntity);
    this.idCounter++;

    return outboundBundleEntity;
  }

  async findByProviderAndId(
    provider: AuthProvider,
    outboundBundleId: OutboundBundleId,
  ): Promise<OutboundBundleEntity | null> {
    const outboundBundle = this.store.find(
      (outboundBundle) =>
        outboundBundle.id === outboundBundleId.value &&
        outboundBundle.userId === provider.id.value,
    );

    if (!outboundBundle) {
      return null;
    }

    return outboundBundle;
  }

  async findByProvider(
    provider: AuthProvider,
    pagination: Pagination,
  ): Promise<{ data: OutboundBundleEntity[]; totalCount: number }> {
    const data = this.store
      .filter((outboundBundle) => outboundBundle.userId === provider.id.value)
      .sort((a, b) => {
        const key = pagination.sort.sortKey as keyof OutboundBundleEntity;
        const aValue = a[key] ?? '';
        const bValue = b[key] ?? '';
        if (pagination.sort.isAsc()) {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

    const paginatedData = data.slice(
      pagination.offset - 1,
      pagination.offset - 1 + pagination.limit,
    );
    const totalCount = data.length;

    return {
      data: paginatedData,
      totalCount,
    };
  }

  async deleteAll(): Promise<void> {
    this.store = [];
    this.idCounter = 1;
  }
}
