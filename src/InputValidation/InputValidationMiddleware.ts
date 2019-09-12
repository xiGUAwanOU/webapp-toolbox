import * as Ajv from "ajv";
import { NextFunction, Request, Response } from "express";

import InputValidationError from "./InputValidationError";

export default class InputValidationMiddleware {
  private validateFunction: Ajv.ValidateFunction;

  public constructor(jsonSchema: object) {
    this.validateFunction = new Ajv().compile(jsonSchema);
  }

  public handleInputValidation(dataExtractor: (req: Request) => any) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = dataExtractor(req);
        this.validateJsonSchema(data);
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

  private validateJsonSchema(jsonObject: any) {
    if (!this.validateFunction(jsonObject)) {
      const firstError = this.validateFunction.errors![0];

      let errorMessage;
      if (firstError.dataPath) {
        errorMessage = `Field "${firstError.dataPath}" ${firstError.message}`;
      } else {
        errorMessage = `Object ${firstError.message}`;
      }

      throw new InputValidationError(errorMessage);
    }
  }
}
