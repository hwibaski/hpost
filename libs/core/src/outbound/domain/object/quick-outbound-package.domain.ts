import { OutboundBundleId } from '@core/outbound/domain/object/outbound-bundle.domain';
import { Item } from '@core/outbound/domain/vo/item';
import { Location } from '@core/outbound/domain/vo/location';
import { VehicleOption } from '@core/outbound/domain/vo/vehicle-option';

export class QuickOutboundPackageId {
  private constructor(readonly value: string) {}

  static of(value: string) {
    return new QuickOutboundPackageId(value);
  }
}

export class QuickOutboundPackage {
  readonly id: QuickOutboundPackageId;
  readonly number: string;
  readonly origin: Location;
  readonly destination: Location;
  readonly item: Item;
  readonly vehicleOption: VehicleOption;
  readonly clientRequestComment: string;
  readonly bundleId: OutboundBundleId;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date | null;

  private constructor({
    id,
    number,
    origin,
    destination,
    item,
    vehicleOption,
    clientRequestComment,
    bundleId,
    createdAt,
    updatedAt,
    deletedAt,
  }: Pick<
    QuickOutboundPackage,
    | 'id'
    | 'number'
    | 'origin'
    | 'destination'
    | 'item'
    | 'vehicleOption'
    | 'clientRequestComment'
    | 'bundleId'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt'
  >) {
    this.id = id;
    this.number = number;
    this.origin = origin;
    this.destination = destination;
    this.item = item;
    this.vehicleOption = vehicleOption;
    this.clientRequestComment = clientRequestComment;
    this.bundleId = bundleId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  static of({
    id,
    number,
    origin,
    destination,
    item,
    vehicleOption,
    clientRequestComment,
    bundleId,
    createdAt,
    updatedAt,
    deletedAt,
  }: Pick<
    QuickOutboundPackage,
    | 'id'
    | 'number'
    | 'origin'
    | 'destination'
    | 'item'
    | 'vehicleOption'
    | 'clientRequestComment'
    | 'bundleId'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt'
  >) {
    return new QuickOutboundPackage({
      id,
      number,
      origin,
      destination,
      item,
      vehicleOption,
      clientRequestComment,
      bundleId,
      createdAt,
      updatedAt,
      deletedAt,
    });
  }
}
