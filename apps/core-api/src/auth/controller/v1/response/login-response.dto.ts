export class LoginResponseDto {
  readonly accessToken: string;

  private constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  static of(accessToken: string) {
    return new LoginResponseDto(accessToken);
  }
}
