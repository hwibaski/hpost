import { AuthProvider } from '@core/auth/domain/object/auth-provider.domain';
import { DraftOutboundBundle } from '@core/outbound/domain/object/draft-outbound-bundle.domain';
import { DraftQuickOutboundPackage } from '@core/outbound/domain/object/draft-quick-outbound-package.domain';
import { OutboundBundleId } from '@core/outbound/domain/object/outbound-bundle.domain';
import { OutboundBundleRepository } from '@core/outbound/repository/outbound-bundle.repository';
import { QuickOutboundPackageRepository } from '@core/outbound/repository/quick-outbound.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OutboundBundleAppender {
  constructor(
    private readonly outboundBundleRepository: OutboundBundleRepository,
    private readonly quickOutboundPackageRepository: QuickOutboundPackageRepository,
  ) {}

  async append(
    provider: AuthProvider,
    draftOutboundBundle: DraftOutboundBundle,
    draftQuickOutboundPackages: DraftQuickOutboundPackage[],
  ) {
    const savedOutboundBundleEntity = await this.outboundBundleRepository.save(
      provider,
      draftOutboundBundle,
    );

    draftQuickOutboundPackages.forEach((draftQuickOutboundPackage) => {
      draftQuickOutboundPackage.setBundleId(
        OutboundBundleId.of(savedOutboundBundleEntity.id),
      );
    });

    await this.quickOutboundPackageRepository.saveMany(
      draftQuickOutboundPackages,
    );

    return savedOutboundBundleEntity.toOutboundBundle();
  }
}
