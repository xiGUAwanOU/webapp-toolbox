"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ajv = require("ajv");
const InputValidationError_1 = require("../Errors/InputValidationError");
class InputValidator {
    constructor(jsonSchema) {
        this.validateFunction = new Ajv().compile(jsonSchema);
    }
    validate(jsonObject) {
        if (!this.validateFunction(jsonObject)) {
            const firstError = this.validateFunction.errors[0];
            let errorMessage;
            if (firstError.dataPath) {
                errorMessage = `Field '${firstError.dataPath}' ${firstError.message}`;
            }
            else {
                errorMessage = `Object ${firstError.message}`;
            }
            throw new InputValidationError_1.default(errorMessage);
        }
    }
}
exports.default = InputValidator;
//# sourceMappingURL=InputValidator.js.map