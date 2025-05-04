import {
  createAuthProviderFixtureFromUser,
  createDraftAuthUserFixture,
} from '@core/auth/__test__/fixture';
import {
  AuthProvider,
  ProviderId,
} from '@core/auth/domain/object/auth-provider.domain';
import { DraftAuthUser } from '@core/auth/domain/object/draft-auth-user.domain';
import { UserRepository } from '@core/auth/repository/user.repository';
import {
  createDraftOutboundBundleFixture,
  createDraftQuickOutboundPackageFixture,
} from '@core/outbound/__test__/fixtures';
import { OutboundBundleId } from '@core/outbound/domain/object/outbound-bundle.domain';
import { QuickOutboundPackage } from '@core/outbound/domain/object/quick-outbound-package.domain';
import { OutboundBundleOrdererReader } from '@core/outbound/implement/oubound-bundle-orderer-reader';
import { OutboundBundleRepository } from '@core/outbound/repository/outbound-bundle.repository';
import { QuickOutboundPackageRepository } from '@core/outbound/repository/quick-outbound.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { MemoryStorageModule } from '@storage/memory/memory.module';
import { ServiceException } from '@support/exception/service-exception';
import { OutboundBundleReader } from './outbound-bundle-reader';

describe('OutboundBundleReader', () => {
  let reader: OutboundBundleReader;
  let outboundBundleRepository: OutboundBundleRepository;
  let quickOutboundPackageRepository: QuickOutboundPackageRepository;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MemoryStorageModule],
      providers: [OutboundBundleReader, OutboundBundleOrdererReader],
    }).compile();

    reader = module.get<OutboundBundleReader>(OutboundBundleReader);
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

  describe('read', () => {
    test('반환된 객체는 번들 정보와 패키지 정보를 포함해야 한다', async () => {
      // given
      const savedUser = await userRepository.save(
        DraftAuthUser.of({
          email: 'test@test.com',
          password: 'test',
          name: 'test',
          phoneNumber: '01012345678',
        }),
      );
      const authProvider = AuthProvider.of({
        id: ProviderId.from(savedUser.id),
        email: savedUser.email,
        name: savedUser.name,
        phoneNumber: savedUser.phoneNumber,
        target: 'portal',
      });
      const bundle = await outboundBundleRepository.save(
        authProvider,
        createDraftOutboundBundleFixture(),
      );

      // when
      const result = await reader.read(
        authProvider,
        OutboundBundleId.from(bundle.id),
      );

      // then
      expect(result).toEqual(
        expect.objectContaining({
          id: expect.objectContaining({ value: bundle.id }),
          channel: expect.objectContaining({ value: bundle.channel }),
          number: bundle.number,
          category: bundle.category,
          quickOutboundPackages: [],
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });

    test('상세 조회 시 패키지 정보도 함께 조회한다', async () => {
      // given
      const savedUser = await userRepository.save(createDraftAuthUserFixture());
      const authProvider = createAuthProviderFixtureFromUser(savedUser);
      const bundle = await outboundBundleRepository.save(
        authProvider,
        createDraftOutboundBundleFixture(),
      );
      await quickOutboundPackageRepository.saveMany([
        createDraftQuickOutboundPackageFixture({
          bundleId: OutboundBundleId.from(bundle.id),
        }),
      ]);

      // when
      const result = await reader.read(
        authProvider,
        OutboundBundleId.from(bundle.id),
      );

      // then
      expect(result.quickOutboundPackages).toEqual(
        expect.arrayContaining([expect.any(QuickOutboundPackage)]),
      );
    });

    test('번들이 존재하지 않을 경우 예외를 발생시키는데, 예외는 ServiceException 인스턴스여야 한다', async () => {
      // given
      const savedUser = await userRepository.save(createDraftAuthUserFixture());
      const authProvider = createAuthProviderFixtureFromUser(savedUser);
      const bundleId = OutboundBundleId.from('test-bundle-id');
      // when & then
      await expect(reader.read(authProvider, bundleId)).rejects.toThrow(
        ServiceException,
      );
    });

    test('번들이 존재하지 않을 경우 예외를 발생시키는데,예외 메세지는 번들을 찾을 수 없다는 메세지여야 한다', async () => {
      // given
      const savedUser = await userRepository.save(createDraftAuthUserFixture());
      const authProvider = createAuthProviderFixtureFromUser(savedUser);
      const bundleId = OutboundBundleId.from('test-bundle-id');

      // when & then
      await expect(reader.read(authProvider, bundleId)).rejects.toThrow(
        `bundle을 찾을 수 없습니다. id: ${bundleId.value}`,
      );
    });
  });
});
