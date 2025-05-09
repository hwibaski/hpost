import { ValidationFailException } from '@support/exception/service-exception';

export class Location {
  readonly name: string;
  readonly detailAddress: string;
  readonly phoneNumber: string;
  readonly roadAddress: string;
  readonly jibunAddress: string;
  readonly postalCode: string;
  readonly latitude: number;
  readonly longitude: number;

  private constructor({
    name,
    detailAddress,
    phoneNumber,
    roadAddress,
    jibunAddress,
    postalCode,
    latitude,
    longitude,
  }: Pick<
    Location,
    | 'name'
    | 'detailAddress'
    | 'phoneNumber'
    | 'roadAddress'
    | 'jibunAddress'
    | 'postalCode'
    | 'latitude'
    | 'longitude'
  >) {
    this.name = name;
    this.detailAddress = detailAddress;
    this.phoneNumber = phoneNumber;
    this.roadAddress = roadAddress;
    this.jibunAddress = jibunAddress;
    this.postalCode = postalCode;
    this.latitude = latitude;
    this.longitude = longitude;

    this.validateProps({
      name,
      detailAddress,
      phoneNumber,
      roadAddress,
      jibunAddress,
      postalCode,
      latitude,
      longitude,
    });
  }

  private validateProps({
    name,
    phoneNumber,
    roadAddress,
    jibunAddress,
    postalCode,
    latitude,
    longitude,
  }: Pick<
    Location,
    | 'name'
    | 'detailAddress'
    | 'phoneNumber'
    | 'roadAddress'
    | 'jibunAddress'
    | 'postalCode'
    | 'latitude'
    | 'longitude'
  >) {
    if (!name || name.trim() === '') {
      throw ValidationFailException('이름은 필수 입력값입니다.');
    }
    if (!phoneNumber || phoneNumber.trim() === '') {
      throw ValidationFailException('전화번호는 필수 입력값입니다.');
    }
    if (!roadAddress || roadAddress.trim() === '') {
      throw ValidationFailException('도로명주소는 필수 입력값입니다.');
    }
    if (!jibunAddress || jibunAddress.trim() === '') {
      throw ValidationFailException('지번주소는 필수 입력값입니다.');
    }
    if (!postalCode || postalCode.trim() === '') {
      throw ValidationFailException('우편번호는 필수 입력값입니다.');
    }
    if (latitude === null || latitude === undefined) {
      throw ValidationFailException('위도는 필수 입력값입니다.');
    }
    if (longitude === null || longitude === undefined) {
      throw ValidationFailException('경도는 필수 입력값입니다.');
    }
  }

  static of({
    name,
    detailAddress,
    phoneNumber,
    roadAddress,
    jibunAddress,
    postalCode,
    latitude,
    longitude,
  }: Pick<
    Location,
    | 'name'
    | 'detailAddress'
    | 'phoneNumber'
    | 'roadAddress'
    | 'jibunAddress'
    | 'postalCode'
    | 'latitude'
    | 'longitude'
  >) {
    return new Location({
      name,
      detailAddress,
      phoneNumber,
      roadAddress,
      jibunAddress,
      postalCode,
      latitude,
      longitude,
    });
  }
}

export class LocationCoordinate {
  readonly latitude: number;
  readonly longitude: number;

  private constructor({
    latitude,
    longitude,
  }: Pick<LocationCoordinate, 'latitude' | 'longitude'>) {
    this.validateProps({ latitude, longitude });
    this.latitude = latitude;
    this.longitude = longitude;
  }

  static of({
    latitude,
    longitude,
  }: Pick<LocationCoordinate, 'latitude' | 'longitude'>) {
    return new LocationCoordinate({ latitude, longitude });
  }

  private validateProps({
    latitude,
    longitude,
  }: Pick<LocationCoordinate, 'latitude' | 'longitude'>) {
    if (latitude === null || latitude === undefined) {
      throw ValidationFailException('위도는 필수 입력값입니다.');
    }
    if (longitude === null || longitude === undefined) {
      throw ValidationFailException('경도는 필수 입력값입니다.');
    }
  }
}
