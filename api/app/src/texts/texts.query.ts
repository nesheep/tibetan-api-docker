import { BadRequestException } from "@nestjs/common";

export interface kwicQueryRaw {
  length: string,
  limit: string,
  shuffle: string
}

export class kwicQuery {
  public length: number;
  public limit: number;
  public shuffle: boolean;

  constructor(queryRaw: kwicQueryRaw) {
    this.length = this.initLength(queryRaw);
    this.limit = this.initLimit(queryRaw);
    this.shuffle = this.initShuffle(queryRaw);
  }

  private initLength(queryRaw: kwicQueryRaw): number {
    if (queryRaw.length === undefined) {
      return 100; // default
    }
    if (queryRaw.length === '') {
      return 100; // default
    }
    if (Array.isArray(queryRaw.length)) {
      throw new BadRequestException();
    }
    if (!Number.isInteger(Number(queryRaw.length))) {
      throw new BadRequestException();
    }
    if (Number(queryRaw.length) < 0) {
      throw new BadRequestException();
    }
    return Number(queryRaw.length);
  }

  private initLimit(queryRaw: kwicQueryRaw): number {
    if (queryRaw.limit === undefined) {
      return 100; // default
    }
    if (queryRaw.limit === '') {
      return 100; // default
    }
    if (Array.isArray(queryRaw.limit)) {
      throw new BadRequestException();
    }
    if (!Number.isInteger(Number(queryRaw.limit))) {
      throw new BadRequestException();
    }
    if (Number(queryRaw.limit) < 0) {
      throw new BadRequestException();
    }
    return Number(queryRaw.limit);
  }

  private initShuffle(queryRaw: kwicQueryRaw): boolean {
    if (queryRaw.shuffle === undefined) {
      return false; // default
    }
    if (queryRaw.shuffle === '') {
      return false; // default
    }
    if (Array.isArray(queryRaw.shuffle)) {
      throw new BadRequestException();
    }
    if (queryRaw.shuffle === 'true') {
      return true;
    }
    if (queryRaw.shuffle === 'false') {
      return false;
    }
    throw new BadRequestException();
  }
}