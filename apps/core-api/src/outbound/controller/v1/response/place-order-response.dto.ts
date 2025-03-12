import { OutboundBundle } from '@core/outbound/domain/object/outbound-bundle.domain';

const PlaceQuickOutboundBundleResponseTypeSymbol: unique symbol = Symbol(
  'PlaceQuickOutboundBundleResponseType',
);

export class PlaceQuickOutboundBundleResponseDto {
  private readonly [PlaceQuickOutboundBundleResponseTypeSymbol]: void;

  readonly id: string;

  private constructor(outboundBundle: OutboundBundle) {
    this.id = outboundBundle.id.value;
  }

  static of(
    outboundBundle: OutboundBundle,
  ): PlaceQuickOutboundBundleResponseDto {
    return new PlaceQuickOutboundBundleResponseDto(outboundBundle);
  }
}
