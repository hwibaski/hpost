import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

import { AuthProviderReader } from '@core/auth/implement/auth-provider-reader';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authProviderReader: AuthProviderReader,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const bearer = request.headers?.authorization;

    if (!bearer) {
      throw new ForbiddenException('Authorization Header에 토큰이 필요합니다.');
    }

    const token = typeof bearer === 'string' ? bearer.split(' ')[1] : null;

    if (!token) {
      throw new ForbiddenException('Authorization Header에 토큰이 필요합니다.');
    }

    try {
      const decoded = this.jwtService.verify<{ userId: string; email: string }>(
        token,
      );

      const authProvider = await this.authProviderReader.findByEmail(
        decoded.email,
      );

      if (!authProvider) {
        throw new ForbiddenException('유효하지 않은 로그인 시도입니다.');
      }

      request.user = authProvider;
    } catch (error) {
      throw new ForbiddenException('로그인 처리 중 오류가 발생했습니다.');
    }

    return true;
  }
}
