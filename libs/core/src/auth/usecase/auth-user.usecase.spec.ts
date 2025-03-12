import { createDraftAuthUserFixture } from '@core/auth/__test__/fixture';
import { StubPasswordVerifier } from '@core/auth/__test__/stub';
import { DraftAuthUser } from '@core/auth/domain/object/draft-auth-user.domain';
import { AuthUserAppender } from '@core/auth/implement/auth-user-appender';
import { AuthUserDuplicateChecker } from '@core/auth/implement/auth-user-duplicate-checker';
import { AuthUserReader } from '@core/auth/implement/auth-user-reader';
import { AuthUserValidator } from '@core/auth/implement/auth-user-validator';
import { PasswordEncoder } from '@core/auth/implement/password-encoder';
import { PasswordVerifier } from '@core/auth/implement/password-verifier';
import { UserRepository } from '@core/auth/repository/user.repository';
import { AuthUserUsecase } from '@core/auth/usecase/auth-user.usecase';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { StorageModule } from '@storage/storage.module';
import { ServiceException } from '@support/exception/service-exception';

describe('AuthUserUsecase', () => {
  let authUserUsecase: AuthUserUsecase;
  let authUserRepository: UserRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [StorageModule],
      providers: [
        AuthUserUsecase,
        AuthUserAppender,
        AuthUserValidator,
        AuthUserDuplicateChecker,
        PasswordEncoder,
        AuthUserReader,
        {
          provide: PasswordVerifier,
          useClass: StubPasswordVerifier,
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('access-token'),
          },
        },
      ],
    }).compile();

    authUserUsecase = module.get<AuthUserUsecase>(AuthUserUsecase);
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
      const result = await authUserUsecase.signup(draftAuthUser);

      // Then
      expect(result.id).toBeDefined();
    });
  });

  describe('login', () => {
    it('email에 해당하는 유저가 없을 경우에는 ForbiddenException을 throw 한다.', async () => {
      // Given
      const email = 'test@example.com';
      const password = 'password';

      // When & Then
      await expect(authUserUsecase.login(email, password)).rejects.toThrow(
        ServiceException,
      );
      await expect(authUserUsecase.login(email, password)).rejects.toThrow(
        '유효하지 않은 로그인 시도입니다.',
      );
    });

    it('비밀번호가 맞지 않는 경우, ForbiddenException을 throw 한다.', async () => {
      // Given
      const mockUser = createDraftAuthUserFixture();
      authUserRepository.save(mockUser);

      // When & Then
      await expect(
        authUserUsecase.login(mockUser.email, 'invalid-password'),
      ).rejects.toThrow(ServiceException);
      await expect(
        authUserUsecase.login(mockUser.email, 'invalid-password'),
      ).rejects.toThrow('유효하지 않은 로그인 시도입니다.');
    });

    it('로그인이 성공할 시 적절한 응답을 리턴한다.', async () => {
      // Given
      const mockUser = createDraftAuthUserFixture();
      authUserRepository.save(mockUser);

      // When
      const result = await authUserUsecase.login(
        mockUser.email,
        mockUser.password,
      );

      // Then
      expect(result).toBeDefined();
    });
  });
});
