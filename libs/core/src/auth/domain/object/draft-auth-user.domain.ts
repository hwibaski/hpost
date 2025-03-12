export class DraftAuthUser {
  readonly name: string;
  readonly email: string;
  readonly phoneNumber: string;
  password: string;

  private constructor({
    name,
    email,
    phoneNumber,
    password,
  }: Pick<DraftAuthUser, 'name' | 'email' | 'phoneNumber' | 'password'>) {
    this.name = name;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.password = password;
  }

  setPassword(password: string) {
    this.password = password;
  }

  static of({
    name,
    email,
    phoneNumber,
    password,
  }: Pick<DraftAuthUser, 'name' | 'email' | 'phoneNumber' | 'password'>) {
    return new DraftAuthUser({ name, email, phoneNumber, password });
  }
}
