import { LoginRequestDto } from '@core-api/auth/controller/v1/request/login-request.dto';
import { SignupRequestDto } from '@core-api/auth/controller/v1/request/signup-request.dto';
import { LoginResponseDto } from '@core-api/auth/controller/v1/response/login-response.dto';
import { MeResponseDto } from '@core-api/auth/controller/v1/response/me-response.dto';
import { SignupResponseDto } from '@core-api/auth/controller/v1/response/signup-response.dto';
import { AuthProvider } from '@core/auth/domain/object/auth-provider.domain';
import { AuthUserUsecase } from '@core/auth/usecase/auth-user.usecase';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthProviderDec } from '@support/decorator/auth-user.decorator';
import { AuthGuard } from '@support/guard/jwt-auth.guard';
import { ApiResponse } from '@support/response/api-response';

@Controller()
export class AuthController {
  constructor(private readonly authUserUsecase: AuthUserUsecase) {}

  @Post('api/v1/auth/signup')
  async signup(
    @Body() body: SignupRequestDto,
  ): Promise<ApiResponse<SignupResponseDto>> {
    const result = await this.authUserUsecase.signup(body.toDraftAuthUser());

    return ApiResponse.success(
      'AuthUser created successfully',
      SignupResponseDto.of(result),
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('api/v1/auth/login')
  async login(
    @Body() body: LoginRequestDto,
  ): Promise<ApiResponse<LoginResponseDto>> {
    const result = await this.authUserUsecase.login(body.email, body.password);

    return ApiResponse.success('Login successful', LoginResponseDto.of(result));
  }

  @UseGuards(AuthGuard)
  @Get('api/v1/auth/me')
  async me(
    @AuthProviderDec() authProvider: AuthProvider,
  ): Promise<ApiResponse<MeResponseDto>> {
    return ApiResponse.success('Me successful', MeResponseDto.of(authProvider));
  }
}
