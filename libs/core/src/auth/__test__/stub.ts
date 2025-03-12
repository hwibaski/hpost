import { PasswordVerifier } from '@core/auth/implement/password-verifier';

export class StubPasswordVerifier extends PasswordVerifier {
  async verify(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return plainPassword === hashedPassword;
  }
}
