import { setNestApp } from '@core-api/config/set-nest-app';
import { CoreApiModule } from '@core-api/core-api.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(CoreApiModule);

  setNestApp(app);
  await app.listen(3000);
}
bootstrap();
