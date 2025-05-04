import { OutboundBundleController } from '@core-api/outbound/controller/v1/outbound-bundle.controller';
import { OutboundModule } from '@core/outbound/outbound.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [OutboundModule],
  controllers: [OutboundBundleController],
})
export class CoreApiOutboundModule {}
