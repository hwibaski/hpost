import { DraftAuthUser } from '@core/auth/domain/object/draft-auth-user.domain';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaUserRepository } from './prisma-user.repository';
import { PrismaService } from './prisma.service';

describe('PrismaUserRepository (integration)', () => {
  let repository: PrismaUserRepository;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, PrismaUserRepository],
    }).compile();

    prisma = module.get(PrismaService);
    repository = module.get(PrismaUserRepository);

    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('should save and find user', async () => {
    const draft = DraftAuthUser.of({
      name: '홍길동',
      email: 'test@test.com',
      phoneNumber: '01012345678',
      password: 'pw',
    });

    const saved = await repository.save(draft);
    expect(saved.email).toBe('test@test.com');
    expect(saved.name).toBe('홍길동');
    expect(saved.phoneNumber).toBe('01012345678');
    expect(saved.password).toBe('pw');
  });

  it('should return null if not found', async () => {
    const found = await repository.findByEmail('notfound@test.com');
    expect(found).toBeNull();
  });
});
