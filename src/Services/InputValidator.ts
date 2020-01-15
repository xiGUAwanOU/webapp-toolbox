import * as Ajv from "ajv";

import InputValidationError from "../Errors/InputValidationError";

export default class InputValidator {
  private validateFunction: Ajv.ValidateFunction;

  public constructor(jsonSchema: object) {
    this.validateFunction = new Ajv().compile(jsonSchema);
  }

  public validate(jsonObject: any) {
    if (!this.validateFunction(jsonObject)) {
      const firstError = this.validateFunction.errors![0];

      let errorMessage;
      if (firstError.dataPath) {
        errorMessage = `Field '${firstError.dataPath}' ${firstError.message}`;
      } else {
        errorMessage = `Object ${firstError.message}`;
      }

      throw new InputValidationError(errorMessage);
    }
  }
}
