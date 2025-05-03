import { createDraftAuthUserFixture } from '@core/auth/__test__/fixture';
import { AuthUserId } from '@core/auth/domain/object/auth-user.domain';
import { AuthUserAppender } from '@core/auth/implement/auth-user-appender';
import { AuthUserDuplicateChecker } from '@core/auth/implement/auth-user-duplicate-checker';
import { AuthUserValidator } from '@core/auth/implement/auth-user-validator';
import { PasswordEncoder } from '@core/auth/implement/password-encoder';
import { UserRepository } from '@core/auth/repository/user.repository';
import { Test } from '@nestjs/testing';
import { MemoryStorageModule } from '@storage/memory/memory.module';

describe('AuthUserAppender', () => {
  let authUserAppender: AuthUserAppender;
  let authUserRepository: UserRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [MemoryStorageModule],
      providers: [
        AuthUserAppender,
        AuthUserValidator,
        AuthUserDuplicateChecker,
        PasswordEncoder,
      ],
    }).compile();

    authUserAppender = module.get<AuthUserAppender>(AuthUserAppender);
    authUserRepository = module.get<UserRepository>(UserRepository);
  });

  afterEach(async () => {
    await authUserRepository.deleteAll();
  });

  describe('append', () => {
    it('클라이언트를 저장하고 저장된 클라이언트를 반환해야 합니다', async () => {
      // Given
      const draftAuthUser = createDraftAuthUserFixture();

      // When
      const result = await authUserAppender.append(draftAuthUser);

      // Then
      expect(result).toEqual(
        expect.objectContaining({
          id: expect.any(AuthUserId),
          name: draftAuthUser.name,
          email: draftAuthUser.email,
          phoneNumber: draftAuthUser.phoneNumber,
        }),
      );
    });

    it('중복된 전화번호와 이메일을 가진 클라이언트가 있으면 예외를 던져야 합니다', async () => {
      // Given
      const draftAuthUser = createDraftAuthUserFixture();

      await authUserRepository.save(draftAuthUser);

      // When
      await expect(authUserAppender.append(draftAuthUser)).rejects.toThrow(
        '이미 가입된 회원입니다.',
      );
    });

    it('전화번호가 유효하지 않으면 예외를 던져야 합니다', async () => {
      // Given
      const draftAuthUser = createDraftAuthUserFixture({
        phoneNumber: '010123',
      });

      // When
      await expect(authUserAppender.append(draftAuthUser)).rejects.toThrow(
        '올바른 전화번호 형식이 아닙니다.',
      );
    });

    it('이메일이 유효하지 않으면 예외를 던져야 합니다', async () => {
      // Given
      const draftAuthUser = createDraftAuthUserFixture({
        email: 'test@email',
      });

      // When
      await expect(authUserAppender.append(draftAuthUser)).rejects.toThrow(
        '올바른 이메일 형식이 아닙니다.',
      );
    });

    it('비밀번호가 유효하지 않으면 예외를 던져야 합니다', async () => {
      // Given
      const draftAuthUser = createDraftAuthUserFixture({
        password: '1234',
      });

      // When
      await expect(authUserAppender.append(draftAuthUser)).rejects.toThrow(
        '비밀번호는 8자 이상 20자 이하로 입력해주세요.',
      );
    });
  });
});
