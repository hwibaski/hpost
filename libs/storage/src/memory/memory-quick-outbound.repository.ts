import { DraftQuickOutboundPackage } from '@core/outbound/domain/object/draft-quick-outbound-package.domain';
import { OutboundBundleId } from '@core/outbound/domain/object/outbound-bundle.domain';
import {
  QuickOutboundPackageEntity,
  QuickOutboundPackageRepository,
} from '@core/outbound/repository/quick-outbound.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MemoryQuickOutboundPackageRepository
  implements QuickOutboundPackageRepository
{
  private store: QuickOutboundPackageEntity[] = [];
  private idCounter = 1;

  async saveMany(
    draftQuickOutboundPackages: DraftQuickOutboundPackage[],
  ): Promise<QuickOutboundPackageEntity[]> {
    const quickOutboundPackages = draftQuickOutboundPackages.map(
      (draftQuickOutboundPackage) => {
        return new QuickOutboundPackageEntity({
          id: this.idCounter.toString(),
          outboundBundleId: draftQuickOutboundPackage.bundleId.value,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
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
          destinationLongitude: draftQuickOutboundPackage.destination.longitude,
          itemDocument: draftQuickOutboundPackage.item.document,
          itemSmallBox: draftQuickOutboundPackage.item.smallBox,
          itemBigBox: draftQuickOutboundPackage.item.bigBox,
          itemEtc: draftQuickOutboundPackage.item.etc,
          itemPrice: draftQuickOutboundPackage.item.price,
          itemWeight: draftQuickOutboundPackage.item.weight,
          vehicleOption: draftQuickOutboundPackage.vehicleOption.type,
          clientRequestComment: draftQuickOutboundPackage.clientRequestComment,
        });
      },
    );

    this.store.push(...quickOutboundPackages);
    this.idCounter += quickOutboundPackages.length;

    return quickOutboundPackages;
  }

  async findByOutboundBundleId(
    outboundBundleId: OutboundBundleId,
  ): Promise<QuickOutboundPackageEntity[]> {
    const filteredStore = this.store.filter(
      (quickOutboundPackage) =>
        quickOutboundPackage.outboundBundleId === outboundBundleId.value,
    );

    return filteredStore;
  }

  async deleteAll(): Promise<void> {
    this.store = [];
    this.idCounter = 1;
  }
}
