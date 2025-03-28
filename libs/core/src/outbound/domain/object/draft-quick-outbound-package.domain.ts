import { OutboundBundleId } from '@core/outbound/domain/object/outbound-bundle.domain';
import { QuickOutboundPackage } from '@core/outbound/domain/object/quick-outbound-package.domain';
import { Item } from '@core/outbound/domain/vo/item';
import { Location } from '@core/outbound/domain/vo/location';
import { VehicleOption } from '@core/outbound/domain/vo/vehicle-option';
import { randomUUID } from 'crypto';

export class DraftQuickOutboundPackage {
  readonly number: string;
  readonly origin: Location;
  readonly destination: Location;
  readonly item: Item;
  readonly vehicleOption: VehicleOption;
  readonly clientRequestComment: string;
  bundleId: OutboundBundleId;

  constructor({
    origin,
    destination,
    item,
    vehicleOption,
    clientRequestComment,
    bundleId,
  }: Pick<
    DraftQuickOutboundPackage,
    | 'origin'
    | 'destination'
    | 'item'
    | 'vehicleOption'
    | 'clientRequestComment'
    | 'bundleId'
  >) {
    this.number = randomUUID();
    this.origin = origin;
    this.destination = destination;
    this.item = item;
    this.vehicleOption = vehicleOption;
    this.clientRequestComment = clientRequestComment;
    this.bundleId = bundleId;
  }

  setBundleId(bundleId: OutboundBundleId) {
    this.bundleId = bundleId;
  }

  static withoutBundleId({
    origin,
    destination,
    item,
    vehicleOption,
    clientRequestComment,
  }: Pick<
    DraftQuickOutboundPackage,
    'origin' | 'destination' | 'item' | 'vehicleOption' | 'clientRequestComment'
  >) {
    return new DraftQuickOutboundPackage({
      origin,
      destination,
      item,
      vehicleOption,
      clientRequestComment,
      bundleId: null,
    });
  }

  static of({
    origin,
    destination,
    item,
    vehicleOption,
    clientRequestComment,
    bundleId,
  }: Pick<
    DraftQuickOutboundPackage,
    | 'origin'
    | 'destination'
    | 'item'
    | 'vehicleOption'
    | 'clientRequestComment'
    | 'bundleId'
  >) {
    return new DraftQuickOutboundPackage({
      origin,
      destination,
      item,
      vehicleOption,
      clientRequestComment,
      bundleId,
    });
  }

  toQuickOutboundPackage() {
    return QuickOutboundPackage.of({
      id: null,
      number: this.number,
      origin: this.origin,
      destination: this.destination,
      item: this.item,
      vehicleOption: this.vehicleOption,
      clientRequestComment: this.clientRequestComment,
      bundleId: this.bundleId,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
  }
}
