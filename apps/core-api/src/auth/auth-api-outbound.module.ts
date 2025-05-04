import { AuthController } from '@core-api/auth/controller/v1/auth.controller';
import { AuthModule } from '@core/auth/auth.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [AuthModule],
  controllers: [AuthController],
})
export class AuthApiOutboundModule {}
