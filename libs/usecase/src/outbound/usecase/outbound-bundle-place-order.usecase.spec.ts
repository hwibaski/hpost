import { createAuthProviderFixture } from '@core/auth/__test__/fixture';
import { UserRepository } from '@core/auth/repository/user.repository';
import {
  createDraftOutboundBundleFixture,
  createDraftQuickOutboundPackageFixture,
} from '@core/outbound/__test__/fixtures';
import { OutboundBundleAppender } from '@core/outbound/implement/outbound-bundle-appender';
import { OutboundBundleRepository } from '@core/outbound/repository/outbound-bundle.repository';
import { QuickOutboundPackageRepository } from '@core/outbound/repository/quick-outbound.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { StorageModule } from '@storage/storage.module';
import { OutboundBundlePlaceOrderUsecase } from 'libs/usecase/src/outbound/usecase/outbound-bundle-place-order.usecase';

describe('OutboundBundlePlaceOrderUsecase', () => {
  let usecase: OutboundBundlePlaceOrderUsecase;
  let outboundBundleRepository: OutboundBundleRepository;
  let quickOutboundPackageRepository: QuickOutboundPackageRepository;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [StorageModule],
      providers: [OutboundBundlePlaceOrderUsecase, OutboundBundleAppender],
    }).compile();

    usecase = module.get<OutboundBundlePlaceOrderUsecase>(
      OutboundBundlePlaceOrderUsecase,
    );
    outboundBundleRepository = module.get<OutboundBundleRepository>(
      OutboundBundleRepository,
    );
    quickOutboundPackageRepository = module.get<QuickOutboundPackageRepository>(
      QuickOutboundPackageRepository,
    );
    userRepository = module.get<UserRepository>(UserRepository);
  });

  afterEach(async () => {
    await outboundBundleRepository.deleteAll();
    await quickOutboundPackageRepository.deleteAll();
    await userRepository.deleteAll();
  });

  describe('placeOrder', () => {
    it('아웃바운드 번들을 생성하고 ID를 반환해야 합니다', async () => {
      // given
      const draftOutboundBundle = createDraftOutboundBundleFixture();
      const draftQuickOutboundPackages = [
        createDraftQuickOutboundPackageFixture(),
      ];
      const provider = createAuthProviderFixture();

      // when
      const result = await usecase.execute(
        provider,
        draftOutboundBundle,
        draftQuickOutboundPackages,
      );

      // then
      expect(result.id.value).toBeDefined();
    });
  });
});
