import { Handler, Request } from "express";

import InputValidator from "../Services/InputValidator";
import BusinessLogicAndErrorHandling from "./BusinessLogicAndErrorHandling";

type IDataExtractor = (req: Request) => any;

export default class InputValidation {
  private inputValidator!: InputValidator;
  private dataExtractor!: IDataExtractor;

  public withJsonSchema(jsonSchema: object) {
    this.inputValidator = new InputValidator(jsonSchema);
    return this;
  }

  public withDataExtractor(dataExtractor: IDataExtractor) {
    this.dataExtractor = dataExtractor;
    return this;
  }

  public done(): Handler {
    return new BusinessLogicAndErrorHandling()
      .withBusinessLogic((req, res, next) => {
        const data = this.dataExtractor(req);
        this.inputValidator.validate(data);
        next();
      })
      .withErrorMapper("InputValidationError", 400)
      .done();
  }
}
