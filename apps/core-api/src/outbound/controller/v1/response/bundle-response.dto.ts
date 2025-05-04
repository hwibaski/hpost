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

  static from(outboundBundle: OutboundBundle): BundleResponseDto {
    return new BundleResponseDto(outboundBundle);
  }

  static fromList(outboundBundles: OutboundBundle[]): BundleResponseDto[] {
    return outboundBundles.map(BundleResponseDto.from);
  }
}
