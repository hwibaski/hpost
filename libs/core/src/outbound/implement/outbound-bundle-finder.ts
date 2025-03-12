import { AuthProvider } from '@core/auth/domain/object/auth-provider.domain';
import { Injectable } from '@nestjs/common';
import { OutboundBundleRepository } from '../repository/outbound-bundle.repository';
import { Pagination, PaginationResult } from '@core/pagination/pagination';

@Injectable()
export class OutboundBundleFinder {
  constructor(
    private readonly outboundBundleRepository: OutboundBundleRepository,
  ) {}

  async findAll(provider: AuthProvider, pagination: Pagination) {
    const data = await this.outboundBundleRepository.findByProvider(
      provider,
      pagination,
    );

    return PaginationResult.of(
      data.totalCount,
      data.data.map((d) => d.toOutboundBundle()),
    );
  }
}
