import { AuthProvider } from '@core/auth/domain/object/auth-provider.domain';
import { OrdererId } from '@core/outbound/domain/object/orderer.domain';
import { OutboundBundleId } from '@core/outbound/domain/object/outbound-bundle.domain';
import { OutboundBundleOrdererReader } from '@core/outbound/implement/oubound-bundle-orderer-reader';
import { OutboundBundleRepository } from '@core/outbound/repository/outbound-bundle.repository';
import { QuickOutboundPackageRepository } from '@core/outbound/repository/quick-outbound.repository';
import { Injectable } from '@nestjs/common';
import { EntityNotFoundException } from '@support/exception/service-exception';

@Injectable()
export class OutboundBundleReader {
  constructor(
    private readonly outboundBundleRepository: OutboundBundleRepository,
    private readonly quickOutboundPackageRepository: QuickOutboundPackageRepository,
    private readonly outboundBundleOrdererReader: OutboundBundleOrdererReader,
  ) {}

  async read(provider: AuthProvider, outboundBundleId: OutboundBundleId) {
    const outboundBundle =
      await this.outboundBundleRepository.findByProviderAndId(
        provider,
        outboundBundleId,
      );
    if (!outboundBundle) {
      throw EntityNotFoundException(
        `bundle을 찾을 수 없습니다. id: ${outboundBundleId.value}`,
      );
    }

    const quickOutboundPackageEntityList =
      await this.quickOutboundPackageRepository.findByOutboundBundleId(
        outboundBundleId,
      );

    const orderer = await this.outboundBundleOrdererReader.read(
      OrdererId.of(outboundBundle.userId),
    );

    const outboundBundleDetail = outboundBundle.toOutboundBundleDetail(
      quickOutboundPackageEntityList,
      orderer,
    );

    return outboundBundleDetail;
  }
}
