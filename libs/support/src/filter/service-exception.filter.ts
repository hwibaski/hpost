import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ServiceException } from '@support/exception/service-exception';
import { ApiResponse } from '@support/response/api-response';

@Catch(ServiceException)
export class ServiceExceptionFilter implements ExceptionFilter {
  catch(exception: ServiceException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.errorCode.status;

    const apiResponse = ApiResponse.forServiceException(exception);

    response.status(status).json(apiResponse);
  }
}
