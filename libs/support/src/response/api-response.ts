import { HttpException } from '@nestjs/common';
import { ServiceException } from '@support/exception/service-exception';
import {
  ApiResponseCode,
  ApiResponseCodeEnum,
} from '@support/response/api-response-code';

export class ApiResponse<T> {
  success: boolean;
  code: ApiResponseCodeEnum;
  message: string;
  errors: string[];
  data: T;

  constructor(
    success: boolean,
    code: ApiResponseCodeEnum,
    message: string,
    errors: string[],
    data: T,
  ) {
    this.success = success;
    this.code = code;
    this.message = message;
    this.errors = errors;
    this.data = data;
  }

  static success<T>(message: string, data: T) {
    return new ApiResponse(true, ApiResponseCode.SUCCESS, message, [], data);
  }

  static for422(message: string, errors: string[]) {
    return new ApiResponse(
      false,
      ApiResponseCode.UNPROCESSABLE_ENTITY,
      message,
      errors,
      null,
    );
  }

  static forHttpException(exception: HttpException) {
    return new ApiResponse(
      false,
      this.toApiResponseCode(exception.getStatus()),
      exception.message,
      [],
      null,
    );
  }

  static toApiResponseCode(httpStatusCode: number) {
    switch (httpStatusCode) {
      case 400:
        return ApiResponseCode.BAD_REQUEST;
      case 401:
        return ApiResponseCode.UNAUTHORIZED;
      case 403:
        return ApiResponseCode.FORBIDDEN;
      case 404:
        return ApiResponseCode.NOT_FOUND;
      default:
        return ApiResponseCode.INTERNAL_SERVER_ERROR;
    }
  }

  static forServiceException(exception: ServiceException) {
    return new ApiResponse(
      false,
      exception.errorCode.code,
      exception.message,
      [],
      null,
    );
  }

  static forInternalServerError() {
    return new ApiResponse(
      false,
      ApiResponseCode.INTERNAL_SERVER_ERROR,
      'Internal server error',
      [],
      null,
    );
  }
}
