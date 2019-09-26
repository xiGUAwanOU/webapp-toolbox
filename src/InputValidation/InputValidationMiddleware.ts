import * as Ajv from "ajv";
import { NextFunction, Request, Response } from "express";

import InputValidationError from "./InputValidationError";
import InputValidator from "./InputValidator";

export default class InputValidationMiddleware {
  private inputValidator: InputValidator;

  public constructor(jsonSchema: object) {
    this.inputValidator = new InputValidator(jsonSchema);
  }

  public handleInputValidation(dataExtractor: (req: Request) => any) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = dataExtractor(req);
        this.inputValidator.validate(data);
        next();
      } catch (error) {
        if (error instanceof InputValidationError) {
          res.status(400);
        } else {
          res.status(500);
        }
        res.json({ message: error.message });
        res.end();
      }
    };
  }
}
