import { DraftAuthUser } from '@core/auth/domain/object/draft-auth-user.domain';
import { Injectable } from '@nestjs/common';
import { ValidationFailException } from '@support/exception/service-exception';

@Injectable()
export class AuthUserValidator {
  validate(draftAuthUser: DraftAuthUser) {
    this.validateName(draftAuthUser.name);
    this.validateEmail(draftAuthUser.email);
    this.validatePhoneNumber(draftAuthUser.phoneNumber);
    this.validatePassword(draftAuthUser.password);
  }

  private validateName(name: string) {
    if (!name) {
      throw ValidationFailException('이름을 입력해주세요.');
    }
    if (name.length < 2 || name.length > 50) {
      throw ValidationFailException(
        '이름은 2자 이상 50자 이하로 입력해주세요.',
      );
    }
  }

  private validateEmail(email: string) {
    if (!email) {
      throw ValidationFailException('이메일을 입력해주세요.');
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      throw ValidationFailException('올바른 이메일 형식이 아닙니다.');
    }
  }

  private validatePhoneNumber(phoneNumber: string) {
    if (!phoneNumber) {
      throw ValidationFailException('전화번호를 입력해주세요.');
    }
    const phoneRegex = /^01[016789][0-9]{8}$/;
    if (!phoneRegex.test(phoneNumber)) {
      throw ValidationFailException('올바른 전화번호 형식이 아닙니다.');
    }
  }

  private validatePassword(password: string) {
    if (!password) {
      throw ValidationFailException('비밀번호를 입력해주세요.');
    }
    if (password.length < 8 || password.length > 20) {
      throw ValidationFailException(
        '비밀번호는 8자 이상 20자 이하로 입력해주세요.',
      );
    }
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      throw ValidationFailException(
        '비밀번호는 영문자와 숫자를 포함해야 합니다.',
      );
    }
  }
}
