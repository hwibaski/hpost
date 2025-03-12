import { Module } from '@nestjs/common';
import { MemoryStorageModule } from '@storage/memory/memory.module';

@Module({
  imports: [MemoryStorageModule],
  exports: [MemoryStorageModule],
})
export class StorageModule {}
