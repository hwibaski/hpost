import {
  DUPLICATE_ENTITY_VO,
  ENTITY_NOT_FOUND_VO,
  ErrorCode,
  FORBIDDEN_VO,
  VALIDATION_FAIL_VO,
} from '@support/exception/error-code';

export const EntityNotFoundException = (message: string): ServiceException => {
  return ServiceException.of(ENTITY_NOT_FOUND_VO, message);
};

export const DuplicateEntityException = (message: string): ServiceException => {
  return ServiceException.of(DUPLICATE_ENTITY_VO, message);
};

export const ValidationFailException = (message: string): ServiceException => {
  return ServiceException.of(VALIDATION_FAIL_VO, message);
};

export const ForbiddenException = (message: string): ServiceException => {
  return ServiceException.of(FORBIDDEN_VO, message);
};

export class ServiceException extends Error {
  public readonly errorCode: ErrorCode;

  constructor(errorCode: ErrorCode, message: string) {
    super(message);
    this.errorCode = errorCode;
  }

  static of(errorCode: ErrorCode, message: string): ServiceException {
    return new ServiceException(errorCode, message);
  }
}
