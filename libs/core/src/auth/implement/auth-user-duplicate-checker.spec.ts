import { createDraftAuthUserFixture } from '@core/auth/__test__/fixture';
import { AuthUserDuplicateChecker } from '@core/auth/implement/auth-user-duplicate-checker';
import { UserRepository } from '@core/auth/repository/user.repository';
import { Test } from '@nestjs/testing';
import { StorageModule } from '@storage/storage.module';
import { ServiceException } from '@support/exception/service-exception';

describe('AuthUserDuplicateChecker', () => {
  let authUserDuplicateChecker: AuthUserDuplicateChecker;
  let authUserRepository: UserRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [StorageModule],
      providers: [AuthUserDuplicateChecker],
    }).compile();

    authUserDuplicateChecker = module.get<AuthUserDuplicateChecker>(
      AuthUserDuplicateChecker,
    );
    authUserRepository = module.get<UserRepository>(UserRepository);
  });

  afterEach(async () => {
    await authUserRepository.deleteAll();
  });

  describe('checkByPhoneNumberAndEmail', () => {
    it('이미 가입된 회원이 있을 경우 DuplicateEntityException을 던져야 한다', async () => {
      // Given
      const email = 'test@email.com';
      const phoneNumber = '01012345678';

      await authUserRepository.save(
        createDraftAuthUserFixture({
          email,
          phoneNumber,
        }),
      );

      // When & Then
      await expect(
        authUserDuplicateChecker.checkByPhoneNumberAndEmail(phoneNumber, email),
      ).rejects.toThrow(ServiceException);
    });
  });
});
