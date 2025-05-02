import { AuthProvider } from '@core/auth/domain/object/auth-provider.domain';
import { OutboundBundleFinder } from '@core/outbound/implement/outbound-bundle-finder';
import { Pagination } from '@core/pagination/pagination';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OutboundBundleFindUsecase {
  constructor(private readonly outboundBundleFinder: OutboundBundleFinder) {}

  async execute(provider: AuthProvider, pagination: Pagination) {
    const outboundBundles = await this.outboundBundleFinder.findAll(
      provider,
      pagination,
    );

    return outboundBundles;
  }
}
