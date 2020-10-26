"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extractBasicAuthCredentials = require("basic-auth");
const BasicAuthError_1 = require("../Errors/BasicAuthError");
const BusinessLogicAndErrorHandling_1 = require("./BusinessLogicAndErrorHandling");
class BasicAuth {
    withCredential(username, password) {
        this.username = username;
        this.password = password;
        return this;
    }
    done() {
        return new BusinessLogicAndErrorHandling_1.default()
            .withBusinessLogic((req, res, next) => {
            this.validateCredentials(req);
            next();
        })
            .withErrorMapper("BasicAuthError", 401)
            .done();
    }
    validateCredentials(req) {
        const credentials = extractBasicAuthCredentials(req);
        if (!credentials || credentials.name !== this.username || credentials.pass !== this.password) {
            throw new BasicAuthError_1.default();
        }
    }
}
exports.default = BasicAuth;
//# sourceMappingURL=BasicAuth.js.map