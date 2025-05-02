import { OutboundBundleController } from '@core-api/outbound/controller/v1/outbound-bundle.controller';
import { Module } from '@nestjs/common';
import { UsecaseModule } from '@usecase/usecase.module';

@Module({
  imports: [UsecaseModule],
  controllers: [OutboundBundleController],
})
export class CoreApiOutboundModule {}
