import { Sort } from '@core/pagination/sort';
import { ValidationFailException } from '@support/exception/service-exception';

export class Pagination {
  readonly limit: number;
  readonly offset: number;
  readonly sort: Sort;

  private constructor(limit: number, offset: number, sort: Sort) {
    this.validate(limit, offset);
    this.limit = limit;
    this.offset = offset;
    this.sort = sort;
  }

  private validate(limit: number, offset: number) {
    if (isNaN(limit) || isNaN(offset)) {
      throw ValidationFailException('limit, offset은 숫자여야 합니다.');
    }

    if (limit === null || offset === null) {
      throw ValidationFailException('limit, offset은 필수입니다.');
    }

    if (limit === undefined || offset === undefined) {
      throw ValidationFailException('limit, offset은 필수입니다.');
    }

    if (limit < 0 || offset < 0) {
      throw ValidationFailException('limit, offset은 0보다 작을 수 없습니다.');
    }
  }

  static of({
    limit,
    offset,
    sort,
  }: {
    limit: number;
    offset: number;
    sort: Sort;
  }) {
    return new Pagination(limit, offset, sort);
  }
}

export class PaginationResult<T> {
  readonly totalCount: number;
  readonly data: T[];

  constructor(total: number, data: T[]) {
    this.totalCount = total;
    this.data = data;
  }

  static of<T>(total: number, data: T[]) {
    return new PaginationResult(total, data);
  }
}
