import { createAuthProviderFixture } from '@core/auth/__test__/fixture';
import {
  createDraftOutboundBundleFixture,
  createDraftQuickOutboundPackageFixture,
} from '@core/outbound/__test__/fixtures';
import { OutboundBundleId } from '@core/outbound/domain/object/outbound-bundle.domain';
import { Channel } from '@core/outbound/domain/vo/channel';
import { OutboundBundleAppender } from '@core/outbound/implement/outbound-bundle-appender';
import { Test, TestingModule } from '@nestjs/testing';
import { StorageModule } from '@storage/storage.module';

describe('OutboundBundleAppender', () => {
  let appender: OutboundBundleAppender;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [StorageModule],
      providers: [OutboundBundleAppender],
    }).compile();

    appender = module.get<OutboundBundleAppender>(OutboundBundleAppender);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('append', () => {
    it('주문자 정보로 새로운 출고 번들을 생성하고 저장해야 한다', async () => {
      // Given
      const draftOutboundBundle = createDraftOutboundBundleFixture();
      const draftQuickOutboundPackages = [
        createDraftQuickOutboundPackageFixture(),
      ];
      const provider = createAuthProviderFixture();

      // When
      const result = await appender.append(
        provider,
        draftOutboundBundle,
        draftQuickOutboundPackages,
      );

      // Then
      expect(result).toEqual(
        expect.objectContaining({
          category: 'quick',
          channel: expect.any(Channel),
          createdAt: expect.any(Date),
          deletedAt: null,
          id: expect.any(OutboundBundleId),
          number: expect.any(String),
          updatedAt: expect.any(Date),
        }),
      );
    });
  });
});
