import { OutboundBundleId } from '@core/outbound/domain/object/outbound-bundle.domain';

export class PlaceOrderResult {
  readonly id: OutboundBundleId;

  private constructor(id: OutboundBundleId) {
    this.id = id;
  }

  static from(id: OutboundBundleId) {
    return new PlaceOrderResult(id);
  }
}
