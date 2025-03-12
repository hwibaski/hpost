export class OrdererId {
  private constructor(readonly value: string) {}

  static of(value: string): OrdererId {
    return new OrdererId(value);
  }
}

export class Orderer {
  readonly id: OrdererId;
  readonly name: string;
  readonly phoneNumber: string;
  readonly email: string;

  private constructor({
    id,
    name,
    phoneNumber,
    email,
  }: Pick<Orderer, 'id' | 'name' | 'phoneNumber' | 'email'>) {
    this.id = id;
    this.phoneNumber = phoneNumber;
    this.name = name;
    this.email = email;
  }

  static of({
    id,
    name,
    phoneNumber,
    email,
  }: Pick<Orderer, 'id' | 'name' | 'phoneNumber' | 'email'>): Orderer {
    return new Orderer({ id, name, phoneNumber, email });
  }
}
