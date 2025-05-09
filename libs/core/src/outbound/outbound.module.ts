import { OutboundBundleOrdererReader } from '@core/outbound/implement/oubound-bundle-orderer-reader';
import { OutboundBundleAppender } from '@core/outbound/implement/outbound-bundle-appender';
import { OutboundBundleFinder } from '@core/outbound/implement/outbound-bundle-finder';
import { OutboundBundleReader } from '@core/outbound/implement/outbound-bundle-reader';
import { QuickChargeAppender } from '@core/outbound/implement/quick-charge-appender';
import {
  QuickChargeCalculator,
  RandomBasedQuickChargeCalculator,
} from '@core/outbound/implement/quick-charge-caculator';
import { OutboundBundleFindUsecase } from '@core/outbound/usecase/outbound-bundle-find.usecase';
import { OutboundBundleGetUsecase } from '@core/outbound/usecase/outbound-bundle-get.usecase';
import { OutboundBundlePlaceOrderUsecase } from '@core/outbound/usecase/outbound-bundle-place-order.usecase';
import { QuickChargeCalculateUsecase } from '@core/outbound/usecase/quick-charge-calculate.usecase';
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
    QuickChargeAppender,
    RandomBasedQuickChargeCalculator,
    QuickChargeCalculateUsecase,
    {
      provide: QuickChargeCalculator,
      useClass: RandomBasedQuickChargeCalculator,
    },
  ],
  exports: [
    OutboundBundleFindUsecase,
    OutboundBundlePlaceOrderUsecase,
    OutboundBundleGetUsecase,
    QuickChargeCalculateUsecase,
  ],
})
export class OutboundModule {}
