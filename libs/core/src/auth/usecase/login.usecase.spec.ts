import { createDraftAuthUserFixture } from '@core/auth/__test__/fixture';
import { StubPasswordVerifier } from '@core/auth/__test__/stub';
import { AuthUserReader } from '@core/auth/implement/auth-user-reader';
import { PasswordVerifier } from '@core/auth/implement/password-verifier';
import { UserRepository } from '@core/auth/repository/user.repository';
import { LoginUsecase } from '@core/auth/usecase/login.usecase';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { MemoryStorageModule } from '@storage/memory/memory.module';
import { ServiceException } from '@support/exception/service-exception';

describe('LoginUsecase', () => {
  let loginUsecase: LoginUsecase;
  let authUserRepository: UserRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [MemoryStorageModule],
      providers: [
        LoginUsecase,
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

    loginUsecase = module.get<LoginUsecase>(LoginUsecase);
    authUserRepository = module.get<UserRepository>(UserRepository);
  });

  afterEach(async () => {
    await authUserRepository.deleteAll();
  });

  describe('login', () => {
    it('email에 해당하는 유저가 없을 경우에는 ForbiddenException을 throw 한다.', async () => {
      // Given
      const email = 'test@example.com';
      const password = 'password';

      // When & Then
      await expect(loginUsecase.execute(email, password)).rejects.toThrow(
        ServiceException,
      );
      await expect(loginUsecase.execute(email, password)).rejects.toThrow(
        '유효하지 않은 로그인 시도입니다.',
      );
    });

    it('비밀번호가 맞지 않는 경우, ForbiddenException을 throw 한다.', async () => {
      // Given
      const mockUser = createDraftAuthUserFixture();
      authUserRepository.save(mockUser);

      // When & Then
      await expect(
        loginUsecase.execute(mockUser.email, 'invalid-password'),
      ).rejects.toThrow(ServiceException);
      await expect(
        loginUsecase.execute(mockUser.email, 'invalid-password'),
      ).rejects.toThrow('유효하지 않은 로그인 시도입니다.');
    });

    it('로그인이 성공할 시 적절한 응답을 리턴한다.', async () => {
      // Given
      const mockUser = createDraftAuthUserFixture();
      authUserRepository.save(mockUser);

      // When
      const result = await loginUsecase.execute(
        mockUser.email,
        mockUser.password,
      );

      // Then
      expect(result).toBeDefined();
    });
  });
});
