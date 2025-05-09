import { LocationCoordinate } from '@core/outbound/domain/vo/location';
import { Weight } from '@core/outbound/domain/vo/weight';
import { Type } from 'class-transformer';
import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';

class LocationCoordinateRequestDto {
  @IsNumber()
  @IsLatitude()
  readonly latitude: number;

  @IsNumber()
  @IsLongitude()
  readonly longitude: number;

  toLocationCoordinate(): LocationCoordinate {
    return LocationCoordinate.of({
      latitude: this.latitude,
      longitude: this.longitude,
    });
  }
}

export class QuickChargeRequestDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LocationCoordinateRequestDto)
  readonly origin: LocationCoordinateRequestDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LocationCoordinateRequestDto)
  readonly destination: LocationCoordinateRequestDto;

  @IsNotEmpty()
  @IsNumber()
  readonly weight: number;

  getWeight(): Weight {
    return Weight.of(this.weight);
  }
}
