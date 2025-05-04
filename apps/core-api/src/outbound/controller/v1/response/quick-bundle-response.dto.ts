import { OutboundBundleDetail } from '@core/outbound/domain/object/outbound-bundle-detail.domain';

const QuickBundleResponseTypeSymbol: unique symbol = Symbol(
  'QuickBundleResponseType',
);

export class QuickBundleResponseDto {
  private readonly [QuickBundleResponseTypeSymbol]: void;

  readonly id: string;
  readonly channel: string;
  readonly number: string;
  readonly createdAt: Date;
  readonly quickOutboundPackages: {
    id: string;
    number: string;
    origin: {
      name: string;
      phoneNumber: string;
    };
    destination: {
      name: string;
      phoneNumber: string;
    };
  }[];

  private constructor(outboundBundleDetail: OutboundBundleDetail) {
    this.id = outboundBundleDetail.id.value;
    this.channel = outboundBundleDetail.channel.value;
    this.number = outboundBundleDetail.number;
    this.createdAt = outboundBundleDetail.createdAt;
    this.quickOutboundPackages = outboundBundleDetail.quickOutboundPackages.map(
      (quickOutboundPackage) => ({
        id: quickOutboundPackage.id.value,
        number: quickOutboundPackage.number,
        origin: {
          name: quickOutboundPackage.origin.name,
          phoneNumber: quickOutboundPackage.origin.phoneNumber,
        },
        destination: {
          name: quickOutboundPackage.destination.name,
          phoneNumber: quickOutboundPackage.destination.phoneNumber,
        },
      }),
    );
  }

  static from(
    outboundBundleDetail: OutboundBundleDetail,
  ): QuickBundleResponseDto {
    return new QuickBundleResponseDto(outboundBundleDetail);
  }
}
