import {
  AuthProvider,
  ProviderId,
} from '@core/auth/domain/object/auth-provider.domain';
import {
  AuthUser,
  AuthUserId,
} from '@core/auth/domain/object/auth-user.domain';
import {
  Orderer,
  OrdererId,
} from '@core/outbound/domain/object/orderer.domain';

export class UserEntity {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  password: string;

  private constructor(user: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
  }) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.phoneNumber = user.phoneNumber;
    this.password = user.password;
  }

  static of(user: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
  }) {
    return new UserEntity(user);
  }

  toAuthUser(): AuthUser {
    return AuthUser.of({
      id: AuthUserId.of(this.id),
      name: this.name,
      email: this.email,
      phoneNumber: this.phoneNumber,
      password: this.password,
    });
  }

  toOrderer() {
    return Orderer.of({
      id: OrdererId.of(this.id),
      name: this.name,
      email: this.email,
      phoneNumber: this.phoneNumber,
    });
  }

  toAuthProvider() {
    return AuthProvider.of({
      id: ProviderId.of(this.id),
      email: this.email,
      name: this.name,
      phoneNumber: this.phoneNumber,
      target: 'portal',
    });
  }
}
