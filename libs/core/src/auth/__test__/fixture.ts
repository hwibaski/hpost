import {
  AuthProvider,
  ProviderId,
} from '@core/auth/domain/object/auth-provider.domain';
import {
  AuthUser,
  AuthUserId,
} from '@core/auth/domain/object/auth-user.domain';
import { DraftAuthUser } from '@core/auth/domain/object/draft-auth-user.domain';
import { UserEntity } from '@core/auth/repository/user.entity';

export const createAuthUserFixture = () => {
  return AuthUser.of({
    id: AuthUserId.of('test-client-id'),
    name: 'test-name',
    email: 'test@example.com',
    phoneNumber: '01012341234',
    password: 'Password1234!',
  });
};

export const createDraftAuthUserFixture = (override = {}) => {
  return DraftAuthUser.of({
    name: 'test-name',
    email: 'test@example.com',
    phoneNumber: '01012341234',
    password: 'Password1234!',
    ...override,
  });
};

export const createAuthProviderFixture = () => {
  return AuthProvider.of({
    id: ProviderId.of('test-provider-id'),
    email: 'test@example.com',
    phoneNumber: '01012341234',
    name: 'test-name',
    target: 'portal',
  });
};

export const createAuthProviderFixtureFromUser = (user: UserEntity) => {
  return AuthProvider.of({
    id: ProviderId.of(user.id),
    email: user.email,
    phoneNumber: user.phoneNumber,
    name: user.name,
    target: 'portal',
  });
};
