export class ApiSliceResult<T> {
  readonly totalCount: number;
  readonly totalPages: number;
  readonly page: number;
  readonly result: T[];

  constructor(total: number, result: T[], limit: number, offset: number) {
    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.floor(offset / limit) + 1;
    this.totalCount = total;
    this.result = result;
    this.totalPages = totalPages;
    this.page = currentPage;
  }

  static of<T>(total: number, data: T[], limit: number, offset: number) {
    return new ApiSliceResult(total, data, limit, offset);
  }
}
