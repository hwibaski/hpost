import { OutboundBundle } from '@core/outbound/domain/object/outbound-bundle.domain';

const BundleResponseTypeSymbol: unique symbol = Symbol('BundleResponseType');

export class BundleResponseDto {
  private readonly [BundleResponseTypeSymbol]: void;

  readonly id: string;
  readonly channel: string;
  readonly number: string;
  readonly createdAt: Date;

  private constructor(outboundBundle: OutboundBundle) {
    this.id = outboundBundle.id.value;
    this.channel = outboundBundle.channel.value;
    this.number = outboundBundle.number;
    this.createdAt = outboundBundle.createdAt;
  }

  static of(outboundBundle: OutboundBundle): BundleResponseDto {
    return new BundleResponseDto(outboundBundle);
  }

  static ofList(outboundBundles: OutboundBundle[]): BundleResponseDto[] {
    return outboundBundles.map(BundleResponseDto.of);
  }
}
