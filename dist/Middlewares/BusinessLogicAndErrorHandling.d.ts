import { Handler, Request } from "express";
export declare type IErrorBodyExtractor = (err: Error, req: Request) => any;
export default class BusinessLogicAndErrorHandling {
    private handler;
    private errorMappers;
    withBusinessLogic(handler: Handler): this;
    withErrorMapper(name: string, statusCode: number, bodyExtractor?: IErrorBodyExtractor): this;
    done(): Handler;
}
