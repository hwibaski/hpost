import {
  createAuthProviderFixture,
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
import { OutboundBundleAppender } from '@core/outbound/implement/outbound-bundle-appender';
import { OutboundBundleFinder } from '@core/outbound/implement/outbound-bundle-finder';
import { OutboundBundleReader } from '@core/outbound/implement/outbound-bundle-reader';
import { OutboundBundleRepository } from '@core/outbound/repository/outbound-bundle.repository';
import { QuickOutboundPackageRepository } from '@core/outbound/repository/quick-outbound.repository';
import { OutboundBundleUsecase } from '@core/outbound/usecase/outbound-bundle.usecase';
import { Pagination } from '@core/pagination/pagination';
import { Sort } from '@core/pagination/sort';
import { Test, TestingModule } from '@nestjs/testing';
import { StorageModule } from '@storage/storage.module';

describe('OutboundBundleUsecase', () => {
  let usecase: OutboundBundleUsecase;
  let outboundBundleRepository: OutboundBundleRepository;
  let quickOutboundPackageRepository: QuickOutboundPackageRepository;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [StorageModule],
      providers: [
        OutboundBundleUsecase,
        OutboundBundleReader,
        OutboundBundleFinder,
        OutboundBundleAppender,
        OutboundBundleOrdererReader,
      ],
    }).compile();

    usecase = module.get<OutboundBundleUsecase>(OutboundBundleUsecase);
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
      const result = await usecase.placeOrder(
        provider,
        draftOutboundBundle,
        draftQuickOutboundPackages,
      );

      // then
      expect(result.id.value).toBeDefined();
    });
  });

  describe('getById', () => {
    it('아웃바운드 번들을 조회하고 반환해야 합니다', async () => {
      // given
      const { bundle, authProvider } = await createProviderAndOutboundBundle();

      // when
      const result = await usecase.get(
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

    describe('getList', () => {
      it('아웃바운드 번들 목록을 조회하고 반환해야 합니다', async () => {
        // given
        const { authProvider } = await createProviderAndOutboundBundle();

        // when
        const result = await usecase.find(
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
