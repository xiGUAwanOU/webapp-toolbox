import { Handler, Request } from "express";
import { IErrorBodyExtractor } from "./BusinessLogicAndErrorHandling";
declare type IDataExtractor = (req: Request) => any;
export default class InputValidation {
    private inputValidator;
    private dataExtractor;
    private errorCode;
    private errorBodyExtractor?;
    withJsonSchema(jsonSchema: object): this;
    withDataExtractor(dataExtractor: IDataExtractor): this;
    withErrorCode(errorCode: number): this;
    withErrorBody(errorBodyExtractor: IErrorBodyExtractor): this;
    done(): Handler;
}
export {};
