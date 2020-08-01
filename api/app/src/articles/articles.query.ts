export interface ArticleQueryRaw {
  code?: string;
  analyzed?: string;
}

export class ArticleQuery {
  code: string;
  analyzed: string | boolean;
  constructor(articleQueryRaw: ArticleQueryRaw) {
    this.code = this.initCode(articleQueryRaw);
    this.analyzed = this.initAnalyzed(articleQueryRaw);
  }

  private initCode(articleQueryRaw: ArticleQueryRaw) {
    if (articleQueryRaw.code === undefined) {
      return '';
    }
    return articleQueryRaw.code;
  }

  private initAnalyzed(articleQueryRaw: ArticleQueryRaw) {
    if (articleQueryRaw.analyzed === undefined) {
      return '';
    }
    if (articleQueryRaw.analyzed === 'true') {
      return true;
    }
    if (articleQueryRaw.analyzed === 'false') {
      return false;
    }
    return articleQueryRaw.analyzed;
  }
}