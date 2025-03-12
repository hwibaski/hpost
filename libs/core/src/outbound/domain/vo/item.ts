import { ValidationFailException } from '@support/exception/service-exception';

export class Item {
  readonly document: number;
  readonly smallBox: number;
  readonly bigBox: number;
  readonly etc: string;
  readonly price: number;
  readonly weight: number;

  constructor({
    document,
    smallBox,
    bigBox,
    etc,
    price,
    weight,
  }: Pick<
    Item,
    'document' | 'smallBox' | 'bigBox' | 'etc' | 'price' | 'weight'
  >) {
    this.validateMutuallyExclusive({ document, smallBox, bigBox, etc });
    this.validateWeight(weight);
    this.validatePrice(price);

    this.document = document;
    this.smallBox = smallBox;
    this.bigBox = bigBox;
    this.etc = etc;
    this.price = price;
    this.weight = weight;
  }

  private validateMutuallyExclusive({
    document,
    smallBox,
    bigBox,
    etc,
  }: Pick<Item, 'document' | 'smallBox' | 'bigBox' | 'etc'>): void {
    const hasDocument = document > 0;
    const hasSmallBox = smallBox > 0;
    const hasBigBox = bigBox > 0;
    const hasEtc = etc.trim().length > 0;

    const activeFields = [hasDocument, hasSmallBox, hasBigBox, hasEtc].filter(
      (field) => field,
    ).length;

    if (activeFields > 1) {
      throw ValidationFailException('아이템 유형은 하나만 선택할 수 있습니다.');
    }

    if (activeFields === 0) {
      throw ValidationFailException('아이템 유형을 선택해야 합니다.');
    }
  }

  private validateWeight(weight: number): void {
    if (weight <= 0) {
      throw ValidationFailException('무게는 0보다 커야 합니다.');
    }
  }

  private validatePrice(price: number): void {
    if (price <= 0 || price >= 1_000_000) {
      throw ValidationFailException(
        '가격은 0보다 크고 100만원보다 작아야 합니다.',
      );
    }
  }

  static of({
    document,
    smallBox,
    bigBox,
    etc,
    price,
    weight,
  }: Pick<
    Item,
    'document' | 'smallBox' | 'bigBox' | 'etc' | 'price' | 'weight'
  >) {
    return new Item({ document, smallBox, bigBox, etc, price, weight });
  }
}
