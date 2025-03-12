import { DraftAuthUser } from '@core/auth/domain/object/draft-auth-user.domain';
import { AuthUserValidator } from './auth-user-validator';

describe('AuthUserValidator', () => {
  let validator: AuthUserValidator;

  beforeEach(() => {
    validator = new AuthUserValidator();
  });

  const validAuthUser = DraftAuthUser.of({
    name: '홍길동',
    email: 'test@example.com',
    phoneNumber: '01012345678',
    password: 'test-password1234',
  });

  describe('이름 검증', () => {
    it('유효한 이름은 검증을 통과해야 한다', () => {
      // given
      const authUser = validAuthUser;

      // when & then
      expect(() => validator.validate(authUser)).not.toThrow();
    });

    it('이름이 비어있으면 예외가 발생해야 한다', () => {
      // given
      const authUser = DraftAuthUser.of({
        name: '',
        email: 'test@example.com',
        phoneNumber: '01012345678',
        password: 'test-password1234',
      });

      // when & then
      expect(() => validator.validate(authUser)).toThrow(
        '이름을 입력해주세요.',
      );
    });

    it('이름이 2자 미만이면 예외가 발생해야 한다', () => {
      // given
      const authUser = DraftAuthUser.of({
        name: '홍',
        email: 'test@example.com',
        phoneNumber: '01012345678',
        password: 'test-password1234',
      });

      // when & then
      expect(() => validator.validate(authUser)).toThrow(
        '이름은 2자 이상 50자 이하로 입력해주세요.',
      );
    });

    it('이름이 50자를 초과하면 예외가 발생해야 한다', () => {
      const authUser = DraftAuthUser.of({
        name: '가'.repeat(51),
        email: 'test@example.com',
        phoneNumber: '01012345678',
        password: 'test-password',
      });
      expect(() => validator.validate(authUser)).toThrow(
        '이름은 2자 이상 50자 이하로 입력해주세요.',
      );
    });
  });

  describe('이메일 검증', () => {
    it('유효한 이메일은 검증을 통과해야 한다', () => {
      // given
      const validEmails = [
        'test@example.com',
        'user.name@example.com',
        'test@example.co.kr',
      ];

      // when & then
      validEmails.forEach((email) => {
        const authUser = DraftAuthUser.of({
          name: '홍길동',
          email,
          phoneNumber: '01012345678',
          password: 'test-password1234',
        });
        expect(() => validator.validate(authUser)).not.toThrow();
      });
    });

    it('이메일이 비어있으면 예외가 발생해야 한다', () => {
      const authUser = DraftAuthUser.of({
        name: '홍길동',
        email: '',
        phoneNumber: '01012345678',
        password: 'test-password1234',
      });
      expect(() => validator.validate(authUser)).toThrow(
        '이메일을 입력해주세요.',
      );
    });

    it('잘못된 이메일 형식이면 예외가 발생해야 한다', () => {
      const invalidEmails = [
        'test',
        'test@',
        '@example.com',
        'test@.com',
        'test@example.',
        'test@example.c',
      ];

      invalidEmails.forEach((email) => {
        const authUser = DraftAuthUser.of({
          name: '홍길동',
          email,
          phoneNumber: '01012345678',
          password: 'test-password1234',
        });
        expect(() => validator.validate(authUser)).toThrow(
          '올바른 이메일 형식이 아닙니다.',
        );
      });
    });
  });

  describe('전화번호 검증', () => {
    it('유효한 전화번호는 검증을 통과해야 한다', () => {
      // given
      const validPhoneNumbers = [
        '01012345678',
        '01112345678',
        '01612345678',
        '01712345678',
        '01812345678',
        '01912345678',
      ];

      // when & then
      validPhoneNumbers.forEach((phoneNumber) => {
        const authUser = DraftAuthUser.of({
          name: '홍길동',
          email: 'test@example.com',
          phoneNumber,
          password: 'test-password1234',
        });
        expect(() => validator.validate(authUser)).not.toThrow();
      });
    });

    it('전화번호가 비어있으면 예외가 발생해야 한다', () => {
      const authUser = DraftAuthUser.of({
        name: '홍길동',
        email: 'test@example.com',
        phoneNumber: '',
        password: 'test-password1234',
      });
      expect(() => validator.validate(authUser)).toThrow(
        '전화번호를 입력해주세요.',
      );
    });

    it('잘못된 전화번호 형식이면 예외가 발생해야 한다', () => {
      const invalidPhoneNumbers = [
        '021234567',
        '0101234567',
        '010123456789',
        '02012345678',
        '01512345678',
      ];

      invalidPhoneNumbers.forEach((phoneNumber) => {
        const authUser = DraftAuthUser.of({
          name: '홍길동',
          email: 'test@example.com',
          phoneNumber,
          password: 'test-password1234',
        });
        expect(() => validator.validate(authUser)).toThrow(
          '올바른 전화번호 형식이 아닙니다.',
        );
      });
    });
  });

  describe('비밀번호 검증', () => {
    it('유효한 비밀번호는 검증을 통과해야 한다', () => {
      // given
      const validPasswords = ['test-password1234', 'Test1234!', 'password123'];

      // when & then
      validPasswords.forEach((password) => {
        const authUser = DraftAuthUser.of({
          name: '홍길동',
          email: 'test@example.com',
          phoneNumber: '01012345678',
          password,
        });
        expect(() => validator.validate(authUser)).not.toThrow();
      });
    });

    it('비밀번호가 비어있으면 예외가 발생해야 한다', () => {
      const authUser = DraftAuthUser.of({
        name: '홍길동',
        email: 'test@example.com',
        phoneNumber: '01012345678',
        password: '',
      });
      expect(() => validator.validate(authUser)).toThrow(
        '비밀번호를 입력해주세요.',
      );
    });

    it('비밀번호가 8자 미만이면 예외가 발생해야 한다', () => {
      const authUser = DraftAuthUser.of({
        name: '홍길동',
        email: 'test@example.com',
        phoneNumber: '01012345678',
        password: 'tespass',
      });
      expect(() => validator.validate(authUser)).toThrow(
        '비밀번호는 8자 이상 20자 이하로 입력해주세요.',
      );
    });

    it('비밀번호가 20자를 초과하면 예외가 발생해야 한다', () => {
      const authUser = DraftAuthUser.of({
        name: '홍길동',
        email: 'test@example.com',
        phoneNumber: '01012345678',
        password: 'test-password12345678901234567890',
      });
      expect(() => validator.validate(authUser)).toThrow(
        '비밀번호는 8자 이상 20자 이하로 입력해주세요.',
      );
    });

    it('비밀번호가 영문자와 숫자를 포함하지 않으면 예외가 발생해야 한다', () => {
      const authUser = DraftAuthUser.of({
        name: '홍길동',
        email: 'test@example.com',
        phoneNumber: '01012345678',
        password: 'password',
      });
      expect(() => validator.validate(authUser)).toThrow(
        '비밀번호는 영문자와 숫자를 포함해야 합니다.',
      );
    });
  });
});
