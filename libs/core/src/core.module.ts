import { AuthModule } from '@core/auth/auth.module';
import { OutboundModule } from '@core/outbound/outbound.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [OutboundModule, AuthModule],
  exports: [OutboundModule, AuthModule],
})
export class CoreModule {}
