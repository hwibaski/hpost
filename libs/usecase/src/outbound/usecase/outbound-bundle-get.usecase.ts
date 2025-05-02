import { AuthProvider } from '@core/auth/domain/object/auth-provider.domain';
import { OutboundBundleId } from '@core/outbound/domain/object/outbound-bundle.domain';
import { OutboundBundleReader } from '@core/outbound/implement/outbound-bundle-reader';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OutboundBundleGetUsecase {
  constructor(private readonly outboundBundleReader: OutboundBundleReader) {}

  async execute(provider: AuthProvider, outboundBundleId: OutboundBundleId) {
    const outboundBundleDetail = await this.outboundBundleReader.read(
      provider,
      outboundBundleId,
    );

    return outboundBundleDetail;
  }
}
