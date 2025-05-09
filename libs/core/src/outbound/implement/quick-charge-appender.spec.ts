import { QuickChargeAppender } from '@core/outbound/implement/quick-charge-appender';
import { QuickChargeRepository } from '@core/outbound/repository/quick-charge.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { MemoryStorageModule } from '@storage/memory/memory.module';

describe('QuickChargeAppender', () => {
  let appender: QuickChargeAppender;
  let quickChargeRepository: QuickChargeRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MemoryStorageModule],
      providers: [QuickChargeAppender],
    }).compile();

    appender = module.get<QuickChargeAppender>(QuickChargeAppender);
    quickChargeRepository = module.get<QuickChargeRepository>(
      QuickChargeRepository,
    );
  });

  afterEach(async () => {
    await quickChargeRepository.deleteAll();
  });

  describe('append', () => {
    it('요금을 받아 QuickCharge를 생성하고 저장해야 합니다', async () => {
      // given
      const charge = 10000;

      // when
      const result = await appender.append(charge);

      // then
      expect(result.id.value).toBeDefined();
      expect(result.baseAmount).toBe(charge);
      expect(result.discountAmount).toBe(0);
      expect(result.comsumedAt).toBeNull();
      expect(result.expiredAt).toBeNull();
    });
  });
});
