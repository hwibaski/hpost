import { DraftOutboundBundle } from '@core/outbound/domain/object/draft-outbound-bundle.domain';
import { DraftQuickOutboundPackage } from '@core/outbound/domain/object/draft-quick-outbound-package.domain';
import {
  OutboundBundle,
  OutboundBundleId,
} from '@core/outbound/domain/object/outbound-bundle.domain';
import {
  QuickOutboundPackage,
  QuickOutboundPackageId,
} from '@core/outbound/domain/object/quick-outbound-package.domain';
import { Channel } from '@core/outbound/domain/vo/channel';
import { Item } from '@core/outbound/domain/vo/item';
import { Location } from '@core/outbound/domain/vo/location';
import { VehicleOption } from '@core/outbound/domain/vo/vehicle-option';

export const createDraftOutboundBundleFixture = () => {
  return DraftOutboundBundle.of();
};

export const createTestOutboundBundleFixture = () => {
  return OutboundBundle.of({
    id: OutboundBundleId.of('test-bundle-id'),
    channel: Channel.of(Channel.PORTAL),
    number: 'test-bundle-number',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    category: 'quick',
  });
};

export const createDraftQuickOutboundPackageFixture = (
  override: Partial<DraftQuickOutboundPackage> = {},
) => {
  const mock = DraftQuickOutboundPackage.of({
    origin: createTestOriginFixture(),
    destination: createTestDestinationFixture(),
    item: createTestItemFixture(),
    vehicleOption: createVehicleOptionFixtrue(),
    clientRequestComment: 'test',
    bundleId: OutboundBundleId.of('test-bundle-id'),
  });

  override && Object.assign(mock, override);

  return mock;
};

export const createTestQuickOutboundPackageFixture = () => {
  return QuickOutboundPackage.of({
    id: QuickOutboundPackageId.of('test-package-id'),
    number: 'test-package-number',
    origin: createTestOriginFixture(),
    destination: createTestDestinationFixture(),
    item: createTestItemFixture(),
    vehicleOption: VehicleOption.of(VehicleOption.BIKE),
    clientRequestComment: 'test',
    bundleId: OutboundBundleId.of('test-bundle-id'),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  });
};

export const createTestOriginFixture = () => {
  return Location.of({
    name: '서울',
    detailAddress: '서울 상세주소',
    phoneNumber: '01012345678',
    roadAddress: '서울 도로명주소',
    jibunAddress: '서울 지번주소',
    postalCode: '12345',
    latitude: 37.5665,
    longitude: 126.978,
  });
};

export const createTestDestinationFixture = () => {
  return Location.of({
    name: '부산',
    detailAddress: '부산 상세주소',
    phoneNumber: '01012345678',
    roadAddress: '부산 도로명주소',
    jibunAddress: '부산 지번주소',
    postalCode: '12345',
    latitude: 35.1665,
    longitude: 129.078,
  });
};

export const createTestItemFixture = () => {
  return Item.of({
    document: 0,
    smallBox: 0,
    bigBox: 0,
    etc: 'test',
    price: 1000,
    weight: 1000,
  });
};
export const createVehicleOptionFixtrue = () => {
  return new VehicleOption(VehicleOption.BIKE);
};
