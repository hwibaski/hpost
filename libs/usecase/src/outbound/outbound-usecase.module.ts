import { CoreModule } from '@core/core.module';
import { Module } from '@nestjs/common';
import { OutboundBundleFindUsecase } from '@usecase/outbound/usecase/outbound-bundle-find.usecase';
import { OutboundBundleGetUsecase } from '@usecase/outbound/usecase/outbound-bundle-get.usecase';
import { OutboundBundlePlaceOrderUsecase } from '@usecase/outbound/usecase/outbound-bundle-place-order.usecase';

@Module({
  imports: [CoreModule],
  providers: [
    OutboundBundleGetUsecase,
    OutboundBundlePlaceOrderUsecase,
    OutboundBundleFindUsecase,
  ],
  exports: [
    OutboundBundleGetUsecase,
    OutboundBundlePlaceOrderUsecase,
    OutboundBundleFindUsecase,
  ],
})
export class OutboundUsecaseModule {}
