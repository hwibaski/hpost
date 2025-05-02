import { DraftOutboundBundle } from '@core/outbound/domain/object/draft-outbound-bundle.domain';
import { DraftQuickOutboundPackage } from '@core/outbound/domain/object/draft-quick-outbound-package.domain';
import { Item } from '@core/outbound/domain/vo/item';
import { Location } from '@core/outbound/domain/vo/location';
import { VehicleOption } from '@core/outbound/domain/vo/vehicle-option';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class OriginRequestDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly detailAddress: string;

  @IsString()
  @IsNotEmpty()
  readonly phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  readonly roadAddress: string;

  @IsString()
  @IsNotEmpty()
  readonly jibunAddress: string;

  @IsString()
  @IsNotEmpty()
  readonly postalCode: string;

  @IsNumber()
  @IsNotEmpty()
  readonly latitude: number;

  @IsNumber()
  @IsNotEmpty()
  readonly longitude: number;

  toLocation(): Location {
    return Location.of({
      name: this.name,
      detailAddress: this.detailAddress,
      phoneNumber: this.phoneNumber,
      roadAddress: this.roadAddress,
      jibunAddress: this.jibunAddress,
      postalCode: this.postalCode,
      latitude: this.latitude,
      longitude: this.longitude,
    });
  }
}

export class DestinationRequestDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly detailAddress: string;

  @IsString()
  @IsNotEmpty()
  readonly phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  readonly roadAddress: string;

  @IsString()
  @IsNotEmpty()
  readonly jibunAddress: string;

  @IsString()
  @IsNotEmpty()
  readonly postalCode: string;

  @IsNumber()
  @IsNotEmpty()
  readonly latitude: number;

  @IsNumber()
  @IsNotEmpty()
  readonly longitude: number;

  toLocation(): Location {
    return Location.of({
      name: this.name,
      detailAddress: this.detailAddress,
      phoneNumber: this.phoneNumber,
      roadAddress: this.roadAddress,
      jibunAddress: this.jibunAddress,
      postalCode: this.postalCode,
      latitude: this.latitude,
      longitude: this.longitude,
    });
  }
}

export class ItemRequestDto {
  @IsNumber()
  @IsNotEmpty()
  readonly document: number;

  @IsNumber()
  @IsNotEmpty()
  readonly smallBox: number;

  @IsNumber()
  @IsNotEmpty()
  readonly bigBox: number;

  @IsString()
  readonly etc: string;

  @IsNumber()
  @IsNotEmpty()
  readonly price: number;

  @IsNumber()
  @IsNotEmpty()
  readonly weight: number;

  toItem(): Item {
    return Item.of({
      document: this.document,
      smallBox: this.smallBox,
      bigBox: this.bigBox,
      etc: this.etc,
      price: this.price,
      weight: this.weight,
    });
  }
}

export class PlaceQuickOutboundPackageRequestDto {
  @ValidateNested()
  @Type(() => OriginRequestDto)
  @IsNotEmpty()
  readonly origin: OriginRequestDto;

  @ValidateNested()
  @Type(() => DestinationRequestDto)
  @IsNotEmpty()
  readonly destination: DestinationRequestDto;

  @ValidateNested()
  @Type(() => ItemRequestDto)
  @IsNotEmpty()
  readonly item: ItemRequestDto;

  @IsString()
  @IsNotEmpty()
  readonly vehicleOption: string;

  @IsString()
  @IsNotEmpty()
  readonly clientRequestComment: string;
}

export class PlaceQuickOutboundBundleRequestDto {
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PlaceQuickOutboundPackageRequestDto)
  readonly packagesToOrder: PlaceQuickOutboundPackageRequestDto[];

  toDraftQuickBundle() {
    return DraftOutboundBundle.of();
  }

  toDraftQuickOutboundPackages() {
    return this.packagesToOrder.map((dto) =>
      DraftQuickOutboundPackage.of({
        origin: dto.origin.toLocation(),
        destination: dto.destination.toLocation(),
        item: dto.item.toItem(),
        vehicleOption: new VehicleOption(dto.vehicleOption as any),
        clientRequestComment: dto.clientRequestComment,
      }),
    );
  }
}
