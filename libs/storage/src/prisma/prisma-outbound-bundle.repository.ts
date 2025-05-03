import { AuthProvider } from '@core/auth/domain/object/auth-provider.domain';
import { DraftOutboundBundle } from '@core/outbound/domain/object/draft-outbound-bundle.domain';
import { OutboundBundleId } from '@core/outbound/domain/object/outbound-bundle.domain';
import {
  OutboundBundleEntity,
  OutboundBundleRepository,
} from '@core/outbound/repository/outbound-bundle.repository';
import { Pagination } from '@core/pagination/pagination';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@storage/prisma/prisma.service';
import { OutboundBundle } from 'generated/prisma';

@Injectable()
export class PrismaOutboundBundleRepository
  implements OutboundBundleRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(
    provider: AuthProvider,
    draftOutboundBundle: DraftOutboundBundle,
  ): Promise<OutboundBundleEntity> {
    const outboundBundle = await this.prisma.outboundBundle.create({
      data: {
        channel: draftOutboundBundle.channel.value,
        number: draftOutboundBundle.number,
        createdAt: draftOutboundBundle.createdAt,
        updatedAt: draftOutboundBundle.updatedAt,
        deletedAt: draftOutboundBundle.deletedAt,
        category: draftOutboundBundle.category,
        userId: provider.id.value,
      },
    });

    return this.toEntity(outboundBundle, provider);
  }

  async findByProviderAndId(
    provider: AuthProvider,
    outboundBundleId: OutboundBundleId,
  ): Promise<OutboundBundleEntity | null> {
    const outboundBundle = await this.prisma.outboundBundle.findUnique({
      where: {
        id: outboundBundleId.value,
        userId: provider.id.value,
      },
    });

    if (!outboundBundle) {
      return null;
    }

    return this.toEntity(outboundBundle, provider);
  }

  async findByProvider(
    provider: AuthProvider,
    pagination: Pagination,
  ): Promise<{ data: OutboundBundleEntity[]; totalCount: number }> {
    const sortKey = pagination.sort.sortKey as keyof OutboundBundleEntity;
    const isAsc = pagination.sort.isAsc();

    const data = await this.prisma.outboundBundle.findMany({
      where: {
        userId: provider.id.value,
      },
      orderBy: {
        [sortKey]: isAsc ? 'asc' : 'desc',
      },
      skip: pagination.offset,
      take: pagination.limit,
    });

    const totalCount = await this.prisma.outboundBundle.count({
      where: {
        userId: provider.id.value,
      },
    });

    return {
      data: data.map((outboundBundle) =>
        this.toEntity(outboundBundle, provider),
      ),
      totalCount,
    };
  }

  async deleteAll(): Promise<void> {
    await this.prisma.quickOutboundPackage.deleteMany();
    await this.prisma.outboundBundle.deleteMany();
  }

  private toEntity(
    outboundBundle: OutboundBundle,
    authProvider: AuthProvider,
  ): OutboundBundleEntity {
    return new OutboundBundleEntity({
      id: outboundBundle.id,
      channel: outboundBundle.channel,
      number: outboundBundle.number,
      createdAt: outboundBundle.createdAt,
      updatedAt: outboundBundle.updatedAt,
      deletedAt: outboundBundle.deletedAt,
      category: outboundBundle.category,
      provider: authProvider,
    });
  }
}
