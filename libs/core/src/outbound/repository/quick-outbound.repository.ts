import { DraftQuickOutboundPackage } from '@core/outbound/domain/object/draft-quick-outbound-package.domain';
import { OutboundBundleId } from '@core/outbound/domain/object/outbound-bundle.domain';
import {
  QuickOutboundPackage,
  QuickOutboundPackageId,
} from '@core/outbound/domain/object/quick-outbound-package.domain';
import { Item } from '@core/outbound/domain/vo/item';
import { Location } from '@core/outbound/domain/vo/location';
import { VehicleOption } from '@core/outbound/domain/vo/vehicle-option';

export class QuickOutboundPackageEntity {
  readonly id: string;
  readonly outboundBundleId: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date;
  readonly number: string;
  readonly originName: string;
  readonly originDetailAddress: string;
  readonly originPhoneNumber: string;
  readonly originRoadAddress: string;
  readonly originJibunAddress: string;
  readonly originPostalCode: string;
  readonly originLatitude: number;
  readonly originLongitude: number;
  readonly destinationName: string;
  readonly destinationDetailAddress: string;
  readonly destinationPhoneNumber: string;
  readonly destinationRoadAddress: string;
  readonly destinationJibunAddress: string;
  readonly destinationPostalCode: string;
  readonly destinationLatitude: number;
  readonly destinationLongitude: number;
  readonly itemDocument: number;
  readonly itemSmallBox: number;
  readonly itemBigBox: number;
  readonly itemEtc: string;
  readonly itemPrice: number;
  readonly itemWeight: number;
  readonly vehicleOption: string;
  readonly clientRequestComment: string;

  constructor({
    id,
    outboundBundleId,
    createdAt,
    updatedAt,
    deletedAt,
    number,
    originName,
    originDetailAddress,
    originPhoneNumber,
    originRoadAddress,
    originJibunAddress,
    originPostalCode,
    originLatitude,
    originLongitude,
    destinationName,
    destinationDetailAddress,
    destinationPhoneNumber,
    destinationRoadAddress,
    destinationJibunAddress,
    destinationPostalCode,
    destinationLatitude,
    destinationLongitude,
    itemDocument,
    itemSmallBox,
    itemBigBox,
    itemEtc,
    itemPrice,
    itemWeight,
    vehicleOption,
    clientRequestComment,
  }: {
    id: string;
    outboundBundleId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    number: string;
    originName: string;
    originDetailAddress: string;
    originPhoneNumber: string;
    originRoadAddress: string;
    originJibunAddress: string;
    originPostalCode: string;
    originLatitude: number;
    originLongitude: number;
    destinationName: string;
    destinationDetailAddress: string;
    destinationPhoneNumber: string;
    destinationRoadAddress: string;
    destinationJibunAddress: string;
    destinationPostalCode: string;
    destinationLatitude: number;
    destinationLongitude: number;
    itemDocument: number;
    itemSmallBox: number;
    itemBigBox: number;
    itemEtc: string;
    itemPrice: number;
    itemWeight: number;
    vehicleOption: string;
    clientRequestComment: string;
  }) {
    this.id = id;
    this.outboundBundleId = outboundBundleId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
    this.number = number;
    this.originName = originName;
    this.originDetailAddress = originDetailAddress;
    this.originPhoneNumber = originPhoneNumber;
    this.originRoadAddress = originRoadAddress;
    this.originJibunAddress = originJibunAddress;
    this.originPostalCode = originPostalCode;
    this.originLatitude = originLatitude;
    this.originLongitude = originLongitude;
    this.destinationName = destinationName;
    this.destinationDetailAddress = destinationDetailAddress;
    this.destinationPhoneNumber = destinationPhoneNumber;
    this.destinationRoadAddress = destinationRoadAddress;
    this.destinationJibunAddress = destinationJibunAddress;
    this.destinationPostalCode = destinationPostalCode;
    this.destinationLatitude = destinationLatitude;
    this.destinationLongitude = destinationLongitude;
    this.itemDocument = itemDocument;
    this.itemSmallBox = itemSmallBox;
    this.itemBigBox = itemBigBox;
    this.itemEtc = itemEtc;
    this.itemPrice = itemPrice;
    this.itemWeight = itemWeight;
    this.vehicleOption = vehicleOption;
    this.clientRequestComment = clientRequestComment;
  }

  toQuickOutboundPackage(): QuickOutboundPackage {
    return QuickOutboundPackage.of({
      id: QuickOutboundPackageId.of(this.id),
      number: this.number,
      origin: Location.of({
        name: this.originName,
        detailAddress: this.originDetailAddress,
        phoneNumber: this.originPhoneNumber,
        roadAddress: this.originRoadAddress,
        jibunAddress: this.originJibunAddress,
        postalCode: this.originPostalCode,
        latitude: this.originLatitude,
        longitude: this.originLongitude,
      }),
      destination: Location.of({
        name: this.destinationName,
        detailAddress: this.destinationDetailAddress,
        phoneNumber: this.destinationPhoneNumber,
        roadAddress: this.destinationRoadAddress,
        jibunAddress: this.destinationJibunAddress,
        postalCode: this.destinationPostalCode,
        latitude: this.destinationLatitude,
        longitude: this.destinationLongitude,
      }),
      item: Item.of({
        document: this.itemDocument,
        smallBox: this.itemSmallBox,
        bigBox: this.itemBigBox,
        etc: this.itemEtc,
        price: this.itemPrice,
        weight: this.itemWeight,
      }),
      vehicleOption: VehicleOption.of(
        this.vehicleOption as
          | typeof VehicleOption.BIKE
          | typeof VehicleOption.CAR,
      ),
      clientRequestComment: this.clientRequestComment,
      bundleId: OutboundBundleId.of(this.outboundBundleId),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    });
  }
}

export abstract class QuickOutboundPackageRepository {
  abstract saveMany(
    draftQuickOutboundPackages: DraftQuickOutboundPackage[],
  ): Promise<QuickOutboundPackageEntity[]>;

  abstract findByOutboundBundleId(
    outboundBundleId: OutboundBundleId,
  ): Promise<QuickOutboundPackageEntity[]>;

  abstract deleteAll(): Promise<void>;
}
