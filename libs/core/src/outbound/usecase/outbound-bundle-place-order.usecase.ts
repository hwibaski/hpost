import { AuthProvider } from '@core/auth/domain/object/auth-provider.domain';
import { DraftOutboundBundle } from '@core/outbound/domain/object/draft-outbound-bundle.domain';
import { DraftQuickOutboundPackage } from '@core/outbound/domain/object/draft-quick-outbound-package.domain';
import { OutboundBundleAppender } from '@core/outbound/implement/outbound-bundle-appender';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OutboundBundlePlaceOrderUsecase {
  constructor(
    private readonly outboundBundleAppender: OutboundBundleAppender,
  ) {}

  async execute(
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
}
