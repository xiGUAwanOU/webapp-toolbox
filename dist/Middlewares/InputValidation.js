"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InputValidator_1 = require("../Services/InputValidator");
const BusinessLogicAndErrorHandling_1 = require("./BusinessLogicAndErrorHandling");
class InputValidation {
    constructor() {
        this.errorCode = 400;
    }
    withJsonSchema(jsonSchema) {
        this.inputValidator = new InputValidator_1.default(jsonSchema);
        return this;
    }
    withDataExtractor(dataExtractor) {
        this.dataExtractor = dataExtractor;
        return this;
    }
    withErrorCode(errorCode) {
        this.errorCode = errorCode;
        return this;
    }
    withErrorBody(errorBodyExtractor) {
        this.errorBodyExtractor = errorBodyExtractor;
        return this;
    }
    done() {
        return new BusinessLogicAndErrorHandling_1.default()
            .withBusinessLogic((req, res, next) => {
            const data = this.dataExtractor(req);
            this.inputValidator.validate(data);
            next();
        })
            .withErrorMapper("InputValidationError", this.errorCode, this.errorBodyExtractor)
            .done();
    }
}
exports.default = InputValidation;
//# sourceMappingURL=InputValidation.js.map