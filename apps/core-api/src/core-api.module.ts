import { AuthApiOutboundModule } from '@core-api/auth/auth-api-outbound.module';
import { CoreApiOutboundModule } from '@core-api/outbound/core-api-outbound.module';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { UnprocessableEntityExceptionFilter } from '@support/filter/422-exception.filter';
import { CatchEverythingFilter } from '@support/filter/base-exception.filter';
import { HttpExceptionFilter } from '@support/filter/http-exception.filter';
import { ServiceExceptionFilter } from '@support/filter/service-exception.filter';

@Module({
  imports: [CoreApiOutboundModule, AuthApiOutboundModule],
  providers: [
    // 역순으로 적용 (ServiceExceptionFilter -> HttpExceptionFilter -> UnprocessableEntityExceptionFilter -> CatchEverythingFilter)
    {
      provide: APP_FILTER,
      useClass: CatchEverythingFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: UnprocessableEntityExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ServiceExceptionFilter,
    },
  ],
})
export class CoreApiModule {}
