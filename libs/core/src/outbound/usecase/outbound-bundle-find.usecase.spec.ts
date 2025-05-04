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
import { OutboundBundleFinder } from '@core/outbound/implement/outbound-bundle-finder';
import { OutboundBundleRepository } from '@core/outbound/repository/outbound-bundle.repository';
import { QuickOutboundPackageRepository } from '@core/outbound/repository/quick-outbound.repository';
import { OutboundBundleFindUsecase } from '@core/outbound/usecase/outbound-bundle-find.usecase';
import { Pagination } from '@core/pagination/pagination';
import { Sort } from '@core/pagination/sort';
import { Test, TestingModule } from '@nestjs/testing';
import { MemoryStorageModule } from '@storage/memory/memory.module';

describe('OutboundBundleFindUsecase', () => {
  let usecase: OutboundBundleFindUsecase;
  let outboundBundleRepository: OutboundBundleRepository;
  let quickOutboundPackageRepository: QuickOutboundPackageRepository;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MemoryStorageModule],
      providers: [OutboundBundleFindUsecase, OutboundBundleFinder],
    }).compile();

    usecase = module.get<OutboundBundleFindUsecase>(OutboundBundleFindUsecase);
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

  describe('getList', () => {
    it('아웃바운드 번들 목록을 조회하고 반환해야 합니다', async () => {
      // given
      const { authProvider } = await createProviderAndOutboundBundle();

      // when
      const result = await usecase.execute(
        authProvider,
        Pagination.of({
          limit: 10,
          offset: 1,
          sort: Sort.of('DSC', 'createdAt'),
        }),
      );

      // then
      expect(result.data.length).toBe(1);
      expect(result.data[0]).toEqual(
        expect.objectContaining({
          id: expect.any(OutboundBundleId),
          channel: expect.any(Channel),
          number: expect.any(String),
          createdAt: expect.any(Date),
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
        bundleId: OutboundBundleId.from(bundle.id),
      }),
    ]);

    return { bundle, authProvider };
  };
});
