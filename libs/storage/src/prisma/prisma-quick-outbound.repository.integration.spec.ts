import { DraftQuickOutboundPackage } from '@core/outbound/domain/object/draft-quick-outbound-package.domain';
import { OutboundBundleId } from '@core/outbound/domain/object/outbound-bundle.domain';
import { Item } from '@core/outbound/domain/vo/item';
import { Location } from '@core/outbound/domain/vo/location';
import { VehicleOption } from '@core/outbound/domain/vo/vehicle-option';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaQuickOutboundPackageRepository } from './prisma-quick-outbound.repository';
import { PrismaService } from './prisma.service';

describe('PrismaQuickOutboundPackageRepository (integration)', () => {
  let repository: PrismaQuickOutboundPackageRepository;
  let prisma: PrismaService;
  let bundleId: OutboundBundleId;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, PrismaQuickOutboundPackageRepository],
    }).compile();

    prisma = module.get(PrismaService);
    repository = module.get(PrismaQuickOutboundPackageRepository);

    await prisma.$connect();
    bundleId = OutboundBundleId.of('test-bundle-id');
  });

  afterAll(async () => {
    await prisma.quickOutboundPackage.deleteMany();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.quickOutboundPackage.deleteMany();
  });

  function createDraftQuickOutboundPackage(): DraftQuickOutboundPackage {
    return DraftQuickOutboundPackage.of({
      origin: Location.of({
        name: '출발지',
        detailAddress: '상세주소',
        phoneNumber: '01012345678',
        roadAddress: '도로명주소',
        jibunAddress: '지번주소',
        postalCode: '12345',
        latitude: 37.1234,
        longitude: 127.5678,
      }),
      destination: Location.of({
        name: '도착지',
        detailAddress: '상세주소',
        phoneNumber: '01087654321',
        roadAddress: '도로명주소',
        jibunAddress: '지번주소',
        postalCode: '54321',
        latitude: 37.5678,
        longitude: 127.1234,
      }),
      item: Item.of({
        document: 1,
        smallBox: 0,
        bigBox: 0,
        etc: '',
        price: 10000,
        weight: 1,
      }),
      vehicleOption: VehicleOption.of(VehicleOption.BIKE),
      clientRequestComment: '빠른 배송 부탁드립니다',
      bundleId,
    });
  }

  it('should save many quick outbound packages', async () => {
    const drafts = [
      createDraftQuickOutboundPackage(),
      createDraftQuickOutboundPackage(),
    ];
    const saved = await repository.saveMany(drafts);
    expect(saved.length).toBe(2);
    expect(saved[0].originName).toBe('출발지');
  });

  it('should find by outboundBundleId', async () => {
    const drafts = [createDraftQuickOutboundPackage()];
    await repository.saveMany(drafts);
    const found = await repository.findByOutboundBundleId(bundleId);
    expect(found.length).toBeGreaterThanOrEqual(1);
    expect(found[0].originName).toBe('출발지');
  });

  it('should delete all', async () => {
    const drafts = [createDraftQuickOutboundPackage()];
    await repository.saveMany(drafts);
    await repository.deleteAll();
    const found = await repository.findByOutboundBundleId(bundleId);
    expect(found.length).toBe(0);
  });
});
