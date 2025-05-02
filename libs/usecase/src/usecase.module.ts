import { Module } from '@nestjs/common';
import { AuthUsecaseModule } from '@usecase/auth/auth-usecase.module';
import { OutboundUsecaseModule } from '@usecase/outbound/outbound-usecase.module';

@Module({
  imports: [AuthUsecaseModule, OutboundUsecaseModule],
  exports: [AuthUsecaseModule, OutboundUsecaseModule],
})
export class UsecaseModule {}
