import { AuthController } from '@core-api/auth/controller/v1/auth.controller';
import { Module } from '@nestjs/common';
import { UsecaseModule } from '@usecase/usecase.module';

@Module({
  imports: [UsecaseModule],
  controllers: [AuthController],
})
export class AuthApiOutboundModule {}
