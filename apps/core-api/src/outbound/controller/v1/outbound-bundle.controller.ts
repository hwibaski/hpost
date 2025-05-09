import { PlaceQuickOutboundBundleRequestDto } from '@core-api/outbound/controller/v1/request/place-quick-order-request.dto';
import { QuickChargeRequestDto } from '@core-api/outbound/controller/v1/request/quick-charge-request.dto';
import { BundleResponseDto } from '@core-api/outbound/controller/v1/response/bundle-response.dto';
import { PlaceQuickOutboundBundleResponseDto } from '@core-api/outbound/controller/v1/response/place-order-response.dto';
import { QuickBundleResponseDto } from '@core-api/outbound/controller/v1/response/quick-bundle-response.dto';
import { QuickChargeResponseDto } from '@core-api/outbound/controller/v1/response/quick-charge-response.dto';
import { AuthProvider } from '@core/auth/domain/object/auth-provider.domain';
import { OutboundBundleId } from '@core/outbound/domain/object/outbound-bundle.domain';
import { OutboundBundleFindUsecase } from '@core/outbound/usecase/outbound-bundle-find.usecase';
import { OutboundBundleGetUsecase } from '@core/outbound/usecase/outbound-bundle-get.usecase';
import { OutboundBundlePlaceOrderUsecase } from '@core/outbound/usecase/outbound-bundle-place-order.usecase';
import { QuickChargeCalculateUsecase } from '@core/outbound/usecase/quick-charge-calculate.usecase';
import { Pagination } from '@core/pagination/pagination';
import { Sort } from '@core/pagination/sort';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthProviderDec } from '@support/decorator/auth-user.decorator';
import { AuthGuard } from '@support/guard/jwt-auth.guard';
import { ApiResponse } from '@support/response/api-response';
import { ApiSliceResult } from '@support/response/api-slice-result';

@Controller()
export class OutboundBundleController {
  constructor(
    private readonly outboundBundleGetUsecase: OutboundBundleGetUsecase,
    private readonly outboundBundleFindUsecase: OutboundBundleFindUsecase,
    private readonly outboundBundlePlaceOrderUsecase: OutboundBundlePlaceOrderUsecase,
    private readonly quickChargeCalculateUsecase: QuickChargeCalculateUsecase,
  ) {}

  @UseGuards(AuthGuard)
  @Post('api/v1/outbound-bundles')
  async createOutboundBundle(
    @Body() body: PlaceQuickOutboundBundleRequestDto,
    @AuthProviderDec() provider: AuthProvider,
  ): Promise<ApiResponse<PlaceQuickOutboundBundleResponseDto>> {
    const result = await this.outboundBundlePlaceOrderUsecase.execute(
      provider,
      body.toDraftQuickBundle(),
      body.toDraftQuickOutboundPackages(),
    );

    return ApiResponse.success(
      'Outbound bundle created successfully',
      PlaceQuickOutboundBundleResponseDto.from(result),
    );
  }

  @UseGuards(AuthGuard)
  @Get('api/v1/outbound-bundles/:id')
  async findOutboundBundleById(
    @Param('id') id: string,
    @AuthProviderDec() provider: AuthProvider,
  ): Promise<ApiResponse<QuickBundleResponseDto>> {
    const result = await this.outboundBundleGetUsecase.execute(
      provider,
      OutboundBundleId.from(id),
    );

    return ApiResponse.success(
      'Outbound bundle found successfully',
      QuickBundleResponseDto.from(result),
    );
  }

  @UseGuards(AuthGuard)
  @Get('api/v1/outbound-bundles')
  async findOutboundBundleList(
    @AuthProviderDec() provider: AuthProvider,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('sortKey') sortKey: string,
    @Query('sort') sort: 'ASC' | 'DSC',
  ): Promise<ApiResponse<ApiSliceResult<BundleResponseDto>>> {
    const pagination = Pagination.of({
      limit,
      offset,
      sort: Sort.of(sort, sortKey),
    });

    const paginatedResult = await this.outboundBundleFindUsecase.execute(
      provider,
      pagination,
    );

    return ApiResponse.success(
      'Outbound bundle list found successfully',
      ApiSliceResult.of(
        paginatedResult.totalCount,
        BundleResponseDto.fromList(paginatedResult.data),
        limit,
        offset,
      ),
    );
  }

  @Post('api/v1/outbound-bundles/quick-charges')
  async calculateQuickCharge(
    @Body() body: QuickChargeRequestDto,
  ): Promise<ApiResponse<QuickChargeResponseDto>> {
    const result = await this.quickChargeCalculateUsecase.execute(
      body.origin.toLocationCoordinate(),
      body.destination.toLocationCoordinate(),
      body.getWeight(),
    );

    return ApiResponse.success(
      'Quick charge calculated successfully',
      QuickChargeResponseDto.from(result),
    );
  }
}
