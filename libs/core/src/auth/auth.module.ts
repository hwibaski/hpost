import { AuthProviderReader } from '@core/auth/implement/auth-provider-reader';
import { AuthUserAppender } from '@core/auth/implement/auth-user-appender';
import { AuthUserDuplicateChecker } from '@core/auth/implement/auth-user-duplicate-checker';
import { AuthUserReader } from '@core/auth/implement/auth-user-reader';
import { AuthUserValidator } from '@core/auth/implement/auth-user-validator';
import { PasswordEncoder } from '@core/auth/implement/password-encoder';
import { PasswordVerifier } from '@core/auth/implement/password-verifier';
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { StorageModule } from '@storage/storage.module';

@Global()
@Module({
  imports: [
    StorageModule,
    JwtModule.register({
      global: true,
      secret: 'secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    AuthUserAppender,
    AuthUserValidator,
    AuthUserDuplicateChecker,
    AuthUserReader,
    AuthProviderReader,
    PasswordEncoder,
    PasswordVerifier,
  ],
  exports: [
    AuthUserAppender,
    AuthUserValidator,
    AuthUserDuplicateChecker,
    AuthUserReader,
    AuthProviderReader,
    PasswordEncoder,
    PasswordVerifier,
  ],
})
export class AuthModule {}
