"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InputValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "InputValidationError";
    }
}
exports.default = InputValidationError;
//# sourceMappingURL=InputValidationError.js.map