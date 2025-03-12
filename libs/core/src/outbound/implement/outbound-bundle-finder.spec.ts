import { createAuthProviderFixture } from '@core/auth/__test__/fixture';
import { createDraftOutboundBundleFixture } from '@core/outbound/__test__/fixtures';
import { OutboundBundleId } from '@core/outbound/domain/object/outbound-bundle.domain';
import { Channel } from '@core/outbound/domain/vo/channel';
import { OutboundBundleFinder } from '@core/outbound/implement/outbound-bundle-finder';
import { OutboundBundleRepository } from '@core/outbound/repository/outbound-bundle.repository';
import { Pagination } from '@core/pagination/pagination';
import { Sort } from '@core/pagination/sort';
import { Test, TestingModule } from '@nestjs/testing';
import { StorageModule } from '@storage/storage.module';

describe('OutboundBundleFinder', () => {
  let finder: OutboundBundleFinder;
  let outboundBundleRepository: OutboundBundleRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [StorageModule],
      providers: [OutboundBundleFinder],
    }).compile();

    finder = module.get<OutboundBundleFinder>(OutboundBundleFinder);
    outboundBundleRepository = module.get<OutboundBundleRepository>(
      OutboundBundleRepository,
    );
  });

  afterEach(async () => {
    await outboundBundleRepository.deleteAll();
  });

  describe('findAll', () => {
    it('모든 OutboundBundle을 조회하고 도메인 객체로 변환하여 반환한다', async () => {
      // given
      const authProvider = createAuthProviderFixture();
      await outboundBundleRepository.save(
        authProvider,
        createDraftOutboundBundleFixture(),
      );

      // when
      const result = await finder.findAll(
        authProvider,
        Pagination.of({
          limit: 10,
          offset: 1,
          sort: Sort.of('DSC', 'createdAt'),
        }),
      );

      // then
      expect(result.totalCount).toEqual(1);
      expect(result.data[0]).toEqual(
        expect.objectContaining({
          category: expect.any(String),
          channel: expect.any(Channel),
          number: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          deletedAt: null,
          id: expect.any(OutboundBundleId),
        }),
      );
    });

    it('저장된 OutboundBundle이 없을 경우 빈 배열을 반환한다', async () => {
      // given
      const authProvider = createAuthProviderFixture();

      // when
      const result = await finder.findAll(
        authProvider,
        Pagination.of({
          limit: 10,
          offset: 1,
          sort: Sort.of('DSC', 'createdAt'),
        }),
      );

      // then
      expect(result.totalCount).toEqual(0);
      expect(result.data).toEqual([]);
    });
  });
});
