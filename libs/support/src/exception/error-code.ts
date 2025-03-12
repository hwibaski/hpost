import {
  ApiResponseCode,
  ApiResponseCodeEnum,
} from '@support/response/api-response-code';

class ErrorCodeVo {
  private constructor(
    readonly status: number,
    readonly code: Exclude<ApiResponseCodeEnum, 'SUCCESS'>,
  ) {}

  static of(status: number, code: Exclude<ApiResponseCodeEnum, 'SUCCESS'>) {
    return new ErrorCodeVo(status, code);
  }
}

export type ErrorCode = ErrorCodeVo;

// ----------------------- Error Code -----------------------

export const ENTITY_NOT_FOUND_VO = ErrorCodeVo.of(
  404,
  ApiResponseCode.ENTITY_NOT_FOUND,
);

export const DUPLICATE_ENTITY_VO = ErrorCodeVo.of(
  409,
  ApiResponseCode.DUPLICATE_ENTITY,
);

export const VALIDATION_FAIL_VO = ErrorCodeVo.of(
  400,
  ApiResponseCode.BAD_REQUEST,
);

export const FORBIDDEN_VO = ErrorCodeVo.of(403, ApiResponseCode.FORBIDDEN);
