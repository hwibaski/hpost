export class AuthUserId {
  private constructor(readonly value: string) {}

  static of(value: string) {
    return new AuthUserId(value);
  }
}

export class AuthUser {
  readonly id: AuthUserId;
  readonly name: string;
  readonly email: string;
  readonly phoneNumber: string;
  readonly password: string;

  private constructor({
    id,
    name,
    email,
    phoneNumber,
    password,
  }: Pick<AuthUser, 'id' | 'name' | 'email' | 'phoneNumber' | 'password'>) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.password = password;
  }

  static of({
    id,
    name,
    email,
    phoneNumber,
    password,
  }: Pick<AuthUser, 'id' | 'name' | 'email' | 'phoneNumber' | 'password'>) {
    return new AuthUser({ id, name, email, phoneNumber, password });
  }
}
