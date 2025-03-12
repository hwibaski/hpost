export class ProviderId {
  private constructor(readonly value: string) {}

  static of(value: string) {
    return new ProviderId(value);
  }
}

export class AuthProvider {
  readonly id: ProviderId;
  readonly name: string;
  readonly email: string;
  readonly phoneNumber: string;
  readonly target: 'portal';

  private constructor({
    id,
    name,
    email,
    phoneNumber,
    target,
  }: Pick<AuthProvider, 'id' | 'name' | 'email' | 'phoneNumber' | 'target'>) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.target = target;
  }

  static of({
    id,
    name,
    email,
    phoneNumber,
    target,
  }: Pick<AuthProvider, 'id' | 'name' | 'email' | 'phoneNumber' | 'target'>) {
    return new AuthProvider({ id, name, email, phoneNumber, target });
  }
}
