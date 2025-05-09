import { UserRepository } from '@core/auth/repository/user.repository';
import { LocationCoordinate } from '@core/outbound/domain/vo/location';
import { Weight } from '@core/outbound/domain/vo/weight';
import { QuickChargeAppender } from '@core/outbound/implement/quick-charge-appender';
import {
  QuickChargeCalculator,
  RandomBasedQuickChargeCalculator,
} from '@core/outbound/implement/quick-charge-caculator';
import { QuickChargeRepository } from '@core/outbound/repository/quick-charge.repository';
import { QuickChargeCalculateUsecase } from '@core/outbound/usecase/quick-charge-calculate.usecase';
import { Test, TestingModule } from '@nestjs/testing';
import { MemoryStorageModule } from '@storage/memory/memory.module';

describe('QuickChargeCalculateUsecase', () => {
  let usecase: QuickChargeCalculateUsecase;
  let quickChargeRepository: QuickChargeRepository;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MemoryStorageModule],
      providers: [
        QuickChargeCalculateUsecase,
        QuickChargeAppender,
        RandomBasedQuickChargeCalculator,
        {
          provide: QuickChargeCalculator,
          useClass: RandomBasedQuickChargeCalculator,
        },
      ],
    }).compile();

    usecase = module.get<QuickChargeCalculateUsecase>(
      QuickChargeCalculateUsecase,
    );
    quickChargeRepository = module.get<QuickChargeRepository>(
      QuickChargeRepository,
    );
    userRepository = module.get<UserRepository>(UserRepository);
  });

  afterEach(async () => {
    await quickChargeRepository.deleteAll();
    await userRepository.deleteAll();
  });

  describe('execute', () => {
    it('요금을 계산하고 QuickCharge를 생성해야 합니다', async () => {
      // given
      const origin = LocationCoordinate.of({
        latitude: 37.5665,
        longitude: 126.978,
      });
      const destination = LocationCoordinate.of({
        latitude: 37.5112,
        longitude: 127.0981,
      });
      const weight = Weight.of(10);

      // when
      const result = await usecase.execute(origin, destination, weight);

      // then
      expect(result.id.value).toBeDefined();
      expect(result.baseAmount).toBeGreaterThan(0);
      expect(result.discountAmount).toBe(0);
      expect(result.expiredAt).toBeNull();
    });
  });
});
