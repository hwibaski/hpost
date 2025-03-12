import { UserRepository } from '@core/auth/repository/user.repository';
import { OutboundBundleRepository } from '@core/outbound/repository/outbound-bundle.repository';
import { QuickOutboundPackageRepository } from '@core/outbound/repository/quick-outbound.repository';
import { Module } from '@nestjs/common';
import { MemoryOutboundBundleRepository } from '@storage/memory/memory-outbound-bundle.repository';
import { MemoryQuickOutboundPackageRepository } from '@storage/memory/memory-quick-outbound.repository';
import { MemoryUserRepository } from '@storage/memory/memory-user.repository';

@Module({
  providers: [
    {
      provide: OutboundBundleRepository,
      useClass: MemoryOutboundBundleRepository,
    },
    {
      provide: QuickOutboundPackageRepository,
      useClass: MemoryQuickOutboundPackageRepository,
    },
    {
      provide: UserRepository,
      useClass: MemoryUserRepository,
    },
  ],
  exports: [
    OutboundBundleRepository,
    QuickOutboundPackageRepository,
    UserRepository,
  ],
})
export class MemoryStorageModule {}
