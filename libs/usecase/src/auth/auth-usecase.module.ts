import { CoreModule } from '@core/core.module';
import { Module } from '@nestjs/common';
import { LoginUsecase } from '@usecase/auth/usecase/login.usecase';
import { SignupUsecase } from '@usecase/auth/usecase/signup.usecase';

@Module({
  imports: [CoreModule],
  providers: [LoginUsecase, SignupUsecase],
  exports: [LoginUsecase, SignupUsecase],
})
export class AuthUsecaseModule {}
