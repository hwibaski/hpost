import { OutboundBundleOrdererReader } from '@core/outbound/implement/oubound-bundle-orderer-reader';
import { OutboundBundleAppender } from '@core/outbound/implement/outbound-bundle-appender';
import { OutboundBundleFinder } from '@core/outbound/implement/outbound-bundle-finder';
import { OutboundBundleReader } from '@core/outbound/implement/outbound-bundle-reader';
import { OutboundBundleFindUsecase } from '@core/outbound/usecase/outbound-bundle-find.usecase';
import { OutboundBundleGetUsecase } from '@core/outbound/usecase/outbound-bundle-get.usecase';
import { OutboundBundlePlaceOrderUsecase } from '@core/outbound/usecase/outbound-bundle-place-order.usecase';
import { Module } from '@nestjs/common';
import { StorageModule } from '@storage/storage.module';

@Module({
  imports: [StorageModule],
  providers: [
    OutboundBundleAppender,
    OutboundBundleReader,
    OutboundBundleFinder,
    OutboundBundleOrdererReader,
    OutboundBundleFindUsecase,
    OutboundBundlePlaceOrderUsecase,
    OutboundBundleGetUsecase,
  ],
  exports: [
    // OutboundBundleAppender,
    // OutboundBundleReader,
    // OutboundBundleFinder,
    // OutboundBundleOrdererReader,
    OutboundBundleFindUsecase,
    OutboundBundlePlaceOrderUsecase,
    OutboundBundleGetUsecase,
  ],
})
export class OutboundModule {}
