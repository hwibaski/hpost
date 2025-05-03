import { UserRepository } from '@core/auth/repository/user.repository';
import { OutboundBundleRepository } from '@core/outbound/repository/outbound-bundle.repository';
import { QuickOutboundPackageRepository } from '@core/outbound/repository/quick-outbound.repository';
import { Module } from '@nestjs/common';
import { PrismaOutboundBundleRepository } from '@storage/prisma/prisma-outbound-bundle.repository';
import { PrismaQuickOutboundPackageRepository } from '@storage/prisma/prisma-quick-outbound.repository';
import { PrismaUserRepository } from '@storage/prisma/prisma-user.repository';
import { PrismaService } from '@storage/prisma/prisma.service';

@Module({
  providers: [
    PrismaService,
    {
      provide: OutboundBundleRepository,
      useClass: PrismaOutboundBundleRepository,
    },
    {
      provide: QuickOutboundPackageRepository,
      useClass: PrismaQuickOutboundPackageRepository,
    },
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [
    OutboundBundleRepository,
    QuickOutboundPackageRepository,
    UserRepository,
  ],
})
export class PrismaModule {}
