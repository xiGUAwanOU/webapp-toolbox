"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BasicAuthError extends Error {
    constructor() {
        super("Basic auth failed, access denied");
        this.name = "BasicAuthError";
    }
}
exports.default = BasicAuthError;
//# sourceMappingURL=BasicAuthError.js.map