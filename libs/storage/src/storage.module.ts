import { Module } from '@nestjs/common';
import { MemoryStorageModule } from '@storage/memory/memory.module';
import { PrismaModule } from '@storage/prisma/prisma.module';

@Module({
  imports: [MemoryStorageModule, PrismaModule],
  exports: [PrismaModule],
})
export class StorageModule {}
