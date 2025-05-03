import { DraftQuickOutboundPackage } from '@core/outbound/domain/object/draft-quick-outbound-package.domain';
import { OutboundBundleId } from '@core/outbound/domain/object/outbound-bundle.domain';
import {
  QuickOutboundPackageEntity,
  QuickOutboundPackageRepository,
} from '@core/outbound/repository/quick-outbound.repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@storage/prisma/prisma.service';
import { QuickOutboundPackage } from 'generated/prisma';

@Injectable()
export class PrismaQuickOutboundPackageRepository
  implements QuickOutboundPackageRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async saveMany(
    draftQuickOutboundPackages: DraftQuickOutboundPackage[],
  ): Promise<QuickOutboundPackageEntity[]> {
    const quickOutboundPackages: QuickOutboundPackageEntity[] = [];

    for (const draftQuickOutboundPackage of draftQuickOutboundPackages) {
      const quickOutboundPackage =
        await this.prisma.quickOutboundPackage.create({
          data: {
            outboundBundleId: draftQuickOutboundPackage.bundleId!.value,
            number: draftQuickOutboundPackage.number,
            originName: draftQuickOutboundPackage.origin.name,
            originDetailAddress: draftQuickOutboundPackage.origin.detailAddress,
            originPhoneNumber: draftQuickOutboundPackage.origin.phoneNumber,
            originRoadAddress: draftQuickOutboundPackage.origin.roadAddress,
            originJibunAddress: draftQuickOutboundPackage.origin.jibunAddress,
            originPostalCode: draftQuickOutboundPackage.origin.postalCode,
            originLatitude: draftQuickOutboundPackage.origin.latitude,
            originLongitude: draftQuickOutboundPackage.origin.longitude,
            destinationName: draftQuickOutboundPackage.destination.name,
            destinationDetailAddress:
              draftQuickOutboundPackage.destination.detailAddress,
            destinationPhoneNumber:
              draftQuickOutboundPackage.destination.phoneNumber,
            destinationRoadAddress:
              draftQuickOutboundPackage.destination.roadAddress,
            destinationJibunAddress:
              draftQuickOutboundPackage.destination.jibunAddress,
            destinationPostalCode:
              draftQuickOutboundPackage.destination.postalCode,
            destinationLatitude: draftQuickOutboundPackage.destination.latitude,
            destinationLongitude:
              draftQuickOutboundPackage.destination.longitude,
            itemDocument: draftQuickOutboundPackage.item.document,
            itemSmallBox: draftQuickOutboundPackage.item.smallBox,
            itemBigBox: draftQuickOutboundPackage.item.bigBox,
            itemEtc: draftQuickOutboundPackage.item.etc,
            itemPrice: draftQuickOutboundPackage.item.price,
            itemWeight: draftQuickOutboundPackage.item.weight,
            vehicleOption: draftQuickOutboundPackage.vehicleOption.type,
            clientRequestComment:
              draftQuickOutboundPackage.clientRequestComment,
          },
        });

      quickOutboundPackages.push(this.toEntity(quickOutboundPackage));
    }

    return quickOutboundPackages;
  }

  async findByOutboundBundleId(
    outboundBundleId: OutboundBundleId,
  ): Promise<QuickOutboundPackageEntity[]> {
    const quickOutboundPackages =
      await this.prisma.quickOutboundPackage.findMany({
        where: {
          outboundBundleId: outboundBundleId.value,
        },
      });

    return quickOutboundPackages.map(this.toEntity);
  }

  async deleteAll(): Promise<void> {
    await this.prisma.quickOutboundPackage.deleteMany();
  }

  private toEntity(
    quickOutboundPackage: QuickOutboundPackage,
  ): QuickOutboundPackageEntity {
    return new QuickOutboundPackageEntity(quickOutboundPackage);
  }
}
