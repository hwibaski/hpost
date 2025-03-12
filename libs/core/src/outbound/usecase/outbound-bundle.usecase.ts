import { AuthProvider } from '@core/auth/domain/object/auth-provider.domain';
import { DraftOutboundBundle } from '@core/outbound/domain/object/draft-outbound-bundle.domain';
import { DraftQuickOutboundPackage } from '@core/outbound/domain/object/draft-quick-outbound-package.domain';
import { OutboundBundleId } from '@core/outbound/domain/object/outbound-bundle.domain';
import { OutboundBundleAppender } from '@core/outbound/implement/outbound-bundle-appender';
import { OutboundBundleFinder } from '@core/outbound/implement/outbound-bundle-finder';
import { OutboundBundleReader } from '@core/outbound/implement/outbound-bundle-reader';
import { Pagination } from '@core/pagination/pagination';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OutboundBundleUsecase {
  constructor(
    private readonly outboundBundleAppender: OutboundBundleAppender,
    private readonly outboundBundleReader: OutboundBundleReader,
    private readonly outboundBundleFinder: OutboundBundleFinder,
  ) {}

  async placeOrder(
    provider: AuthProvider,
    draftOutboundBundle: DraftOutboundBundle,
    draftQuickOutboundPackages: DraftQuickOutboundPackage[],
  ) {
    const outboundBundle = await this.outboundBundleAppender.append(
      provider,
      draftOutboundBundle,
      draftQuickOutboundPackages,
    );

    return outboundBundle;
  }

  async get(provider: AuthProvider, outboundBundleId: OutboundBundleId) {
    const outboundBundleDetail = await this.outboundBundleReader.read(
      provider,
      outboundBundleId,
    );

    return outboundBundleDetail;
  }

  async find(provider: AuthProvider, pagination: Pagination) {
    const outboundBundles = await this.outboundBundleFinder.findAll(
      provider,
      pagination,
    );

    return outboundBundles;
  }
}
