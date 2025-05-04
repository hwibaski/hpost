import {
  createAuthProviderFixtureFromUser,
  createDraftAuthUserFixture,
} from '@core/auth/__test__/fixture';
import { UserRepository } from '@core/auth/repository/user.repository';
import {
  createDraftOutboundBundleFixture,
  createDraftQuickOutboundPackageFixture,
} from '@core/outbound/__test__/fixtures';
import { OutboundBundleId } from '@core/outbound/domain/object/outbound-bundle.domain';
import { Channel } from '@core/outbound/domain/vo/channel';
import { OutboundBundleOrdererReader } from '@core/outbound/implement/oubound-bundle-orderer-reader';
import { OutboundBundleReader } from '@core/outbound/implement/outbound-bundle-reader';
import { OutboundBundleRepository } from '@core/outbound/repository/outbound-bundle.repository';
import { QuickOutboundPackageRepository } from '@core/outbound/repository/quick-outbound.repository';
import { OutboundBundleGetUsecase } from '@core/outbound/usecase/outbound-bundle-get.usecase';
import { Test, TestingModule } from '@nestjs/testing';
import { MemoryStorageModule } from '@storage/memory/memory.module';

describe('OutboundBundleGetUsecase', () => {
  let usecase: OutboundBundleGetUsecase;
  let outboundBundleRepository: OutboundBundleRepository;
  let quickOutboundPackageRepository: QuickOutboundPackageRepository;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MemoryStorageModule],
      providers: [
        OutboundBundleGetUsecase,
        OutboundBundleReader,
        OutboundBundleOrdererReader,
      ],
    }).compile();

    usecase = module.get<OutboundBundleGetUsecase>(OutboundBundleGetUsecase);
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

  describe('getById', () => {
    it('아웃바운드 번들을 조회하고 반환해야 합니다', async () => {
      // given
      const { bundle, authProvider } = await createProviderAndOutboundBundle();

      // when
      const result = await usecase.execute(
        authProvider,
        OutboundBundleId.of(bundle.id),
      );

      // then
      expect(result).toEqual(
        expect.objectContaining({
          id: expect.any(OutboundBundleId),
          channel: expect.any(Channel),
          number: expect.any(String),
          createdAt: expect.any(Date),
          quickOutboundPackages: expect.any(Array),
        }),
      );
    });
  });

  const createProviderAndOutboundBundle = async () => {
    const user = await userRepository.save(createDraftAuthUserFixture());
    const authProvider = createAuthProviderFixtureFromUser(user);
    const bundle = await outboundBundleRepository.save(
      authProvider,
      createDraftOutboundBundleFixture(),
    );
    await quickOutboundPackageRepository.saveMany([
      createDraftQuickOutboundPackageFixture({
        bundleId: OutboundBundleId.of(bundle.id),
      }),
    ]);

    return { bundle, authProvider };
  };
});
