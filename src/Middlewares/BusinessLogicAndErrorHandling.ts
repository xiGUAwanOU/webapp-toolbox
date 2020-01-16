import { Handler, Request } from "express";

export type IErrorBodyExtractor = (err: Error, req: Request) => any;

interface IErrorMapper {
  name: string;
  statusCode: number;
  bodyExtractor?: IErrorBodyExtractor;
}

export default class BusinessLogicAndErrorHandling {
  private handler!: Handler;
  private errorMappers: IErrorMapper[] = [];

  public withBusinessLogic(handler: Handler) {
    this.handler = handler;
    return this;
  }

  public withErrorMapper(name: string, statusCode: number, bodyExtractor?: IErrorBodyExtractor) {
    this.errorMappers.push({ name, statusCode, bodyExtractor });
    return this;
  }

  public done(): Handler {
    return async (req, res, next) => {
      try {
        await this.handler(req, res, next);
      } catch (err) {
        for (const errorMapper of this.errorMappers) {
          if (errorMapper.name === err.name) {
            res.status(errorMapper.statusCode);
            res.json(
              errorMapper.bodyExtractor
                ? errorMapper.bodyExtractor(err, req)
                : { error: err.message },
            );
            res.end();
            return;
          }
        }

        res.status(500);
        res.json({ error: "Internal server error" });
        res.end();
      }
    };
  }
}
