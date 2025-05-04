import {
  AuthProvider,
  ProviderId,
} from '@core/auth/domain/object/auth-provider.domain';
import { DraftOutboundBundle } from '@core/outbound/domain/object/draft-outbound-bundle.domain';
import { OutboundBundleId } from '@core/outbound/domain/object/outbound-bundle.domain';
import { Pagination } from '@core/pagination/pagination';
import { Sort } from '@core/pagination/sort';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaOutboundBundleRepository } from './prisma-outbound-bundle.repository';
import { PrismaService } from './prisma.service';

describe('PrismaOutboundBundleRepository (integration)', () => {
  let repository: PrismaOutboundBundleRepository;
  let prisma: PrismaService;
  let provider: AuthProvider;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, PrismaOutboundBundleRepository],
    }).compile();

    prisma = module.get(PrismaService);
    repository = module.get(PrismaOutboundBundleRepository);

    await prisma.$connect();

    provider = AuthProvider.of({
      id: ProviderId.from('test-provider-id'),
      name: '홍길동',
      email: 'test@test.com',
      phoneNumber: '01012345678',
      target: 'portal',
    });
  });

  afterAll(async () => {
    await prisma.outboundBundle.deleteMany();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.outboundBundle.deleteMany();
  });

  it('should save and find by id', async () => {
    const draft = DraftOutboundBundle.create();
    const saved = await repository.save(provider, draft);
    expect(saved.channel).toBe('PORTAL');
    expect(saved.userId).toBe(provider.id.value);

    const found = await repository.findByProviderAndId(
      provider,
      OutboundBundleId.from(saved.id),
    );
    expect(found).not.toBeNull();
    expect(found?.id).toBe(saved.id);
  });

  it('should return null if not found', async () => {
    const found = await repository.findByProviderAndId(
      provider,
      OutboundBundleId.from('non-existent-id'),
    );
    expect(found).toBeNull();
  });

  it('should find by provider with pagination', async () => {
    // 여러 개 저장
    for (let i = 0; i < 3; i++) {
      await repository.save(provider, DraftOutboundBundle.create());
    }
    const pagination = Pagination.of({
      limit: 2,
      offset: 0,
      sort: Sort.of('ASC', 'createdAt'),
    });
    const result = await repository.findByProvider(provider, pagination);
    expect(result.data.length).toBeLessThanOrEqual(2);
    expect(result.totalCount).toBeGreaterThanOrEqual(3);
  });
});
