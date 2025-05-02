import { OutboundBundleOrdererReader } from '@core/outbound/implement/oubound-bundle-orderer-reader';
import { OutboundBundleAppender } from '@core/outbound/implement/outbound-bundle-appender';
import { OutboundBundleFinder } from '@core/outbound/implement/outbound-bundle-finder';
import { OutboundBundleReader } from '@core/outbound/implement/outbound-bundle-reader';
import { Module } from '@nestjs/common';
import { StorageModule } from '@storage/storage.module';

@Module({
  imports: [StorageModule],
  providers: [
    OutboundBundleAppender,
    OutboundBundleReader,
    OutboundBundleFinder,
    OutboundBundleOrdererReader,
  ],
  exports: [
    OutboundBundleAppender,
    OutboundBundleReader,
    OutboundBundleFinder,
    OutboundBundleOrdererReader,
  ],
})
export class OutboundModule {}
