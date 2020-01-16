import { Handler, Request } from "express";

import InputValidator from "../Services/InputValidator";
import BusinessLogicAndErrorHandling, { IErrorBodyExtractor } from "./BusinessLogicAndErrorHandling";

type IDataExtractor = (req: Request) => any;

export default class InputValidation {
  private inputValidator!: InputValidator;
  private dataExtractor!: IDataExtractor;
  private errorCode: number = 400;
  private errorBodyExtractor?: IErrorBodyExtractor;

  public withJsonSchema(jsonSchema: object) {
    this.inputValidator = new InputValidator(jsonSchema);
    return this;
  }

  public withDataExtractor(dataExtractor: IDataExtractor) {
    this.dataExtractor = dataExtractor;
    return this;
  }

  public withErrorCode(errorCode: number) {
    this.errorCode = errorCode;
    return this;
  }

  public withErrorBody(errorBodyExtractor: IErrorBodyExtractor) {
    this.errorBodyExtractor = errorBodyExtractor;
    return this;
  }

  public done(): Handler {
    return new BusinessLogicAndErrorHandling()
      .withBusinessLogic((req, res, next) => {
        const data = this.dataExtractor(req);
        this.inputValidator.validate(data);
        next();
      })
      .withErrorMapper("InputValidationError", this.errorCode, this.errorBodyExtractor)
      .done();
  }
}
