import { DraftAuthUser } from '@core/auth/domain/object/draft-auth-user.domain';
import { AuthUserAppender } from '@core/auth/implement/auth-user-appender';
import { AuthUserDuplicateChecker } from '@core/auth/implement/auth-user-duplicate-checker';
import { AuthUserValidator } from '@core/auth/implement/auth-user-validator';
import { PasswordEncoder } from '@core/auth/implement/password-encoder';
import { UserRepository } from '@core/auth/repository/user.repository';
import { Test } from '@nestjs/testing';
import { StorageModule } from '@storage/storage.module';
import { SignupUsecase } from 'libs/usecase/src/auth/usecase/signup.usecase';

describe('SignupUsecase', () => {
  let signupUsecase: SignupUsecase;
  let authUserRepository: UserRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [StorageModule],
      providers: [
        SignupUsecase,
        AuthUserAppender,
        AuthUserValidator,
        AuthUserDuplicateChecker,
        PasswordEncoder,
      ],
    }).compile();

    signupUsecase = module.get<SignupUsecase>(SignupUsecase);
    authUserRepository = module.get<UserRepository>(UserRepository);
  });

  afterEach(async () => {
    await authUserRepository.deleteAll();
  });

  describe('signup', () => {
    it('회원가입을 하고 ID를 반환해야 합니다', async () => {
      // Given
      const draftAuthUser = DraftAuthUser.of({
        name: 'test-name',
        email: 'test-email@email.com',
        phoneNumber: '01099007278',
        password: 'test-password1234',
      });

      // When
      const result = await signupUsecase.execute(draftAuthUser);

      // Then
      expect(result.id).toBeDefined();
    });
  });
});
