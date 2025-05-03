export class Sort {
  static readonly ASC = 'ASC';
  static readonly DSC = 'DSC';
  readonly order: 'ASC' | 'DSC';
  readonly sortKey: string;

  private constructor(order: 'ASC' | 'DSC' = 'ASC', sortKey = 'createdAt') {
    this.order = order;
    this.sortKey = sortKey;
  }

  static of(order: 'ASC' | 'DSC' = 'ASC', sortKey = 'createdAt') {
    return new Sort(order, sortKey);
  }

  isAsc() {
    return this.order === Sort.ASC;
  }
}
