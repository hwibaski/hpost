export class LoginResponseDto {
  readonly accessToken: string;

  private constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  static from(accessToken: string) {
    return new LoginResponseDto(accessToken);
  }
}
