import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';

export const setNestApp = <T extends INestApplication>(app: T): void => {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );
};
