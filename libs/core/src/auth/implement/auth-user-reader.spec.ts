import { DraftAuthUser } from '@core/auth/domain/object/draft-auth-user.domain';
import { AuthUserReader } from '@core/auth/implement/auth-user-reader';
import { UserRepository } from '@core/auth/repository/user.repository';
import { Test } from '@nestjs/testing';
import { StorageModule } from '@storage/storage.module';

describe('AuthUserReader', () => {
  let authUserRepository: UserRepository;
  let authUserReader: AuthUserReader;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [StorageModule],
      providers: [AuthUserReader],
    }).compile();

    authUserRepository = module.get<UserRepository>(UserRepository);
    authUserReader = module.get<AuthUserReader>(AuthUserReader);
  });

  afterEach(async () => {
    await authUserRepository.deleteAll();
  });

  describe('findByEmail', () => {
    it('should return user when found by email', async () => {
      // Given
      const draftAuthUser = DraftAuthUser.of({
        name: 'test-name',
        email: 'test@gmail.com',
        phoneNumber: '01012341234',
        password: '1234',
      });
      await authUserRepository.save(draftAuthUser);

      // When
      const result = await authUserReader.findByEmail('test@gmail.com');

      // Then
      expect(result?.email).toBe(draftAuthUser.email);
      expect(result?.name).toBe(draftAuthUser.name);
      expect(result?.phoneNumber).toBe(draftAuthUser.phoneNumber);
    });

    it('should return null when user not found by email', async () => {
      const result = await authUserReader.findByEmail('unknown@example.com');

      expect(result).toBeNull();
    });
  });
});
