"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class BusinessLogicAndErrorHandling {
    constructor() {
        this.errorMappers = [];
    }
    withBusinessLogic(handler) {
        this.handler = handler;
        return this;
    }
    withErrorMapper(name, statusCode, bodyExtractor) {
        this.errorMappers.push({ name, statusCode, bodyExtractor });
        return this;
    }
    done() {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.handler(req, res, next);
            }
            catch (err) {
                for (const errorMapper of this.errorMappers) {
                    if (errorMapper.name === err.name) {
                        res.status(errorMapper.statusCode);
                        res.json(errorMapper.bodyExtractor
                            ? errorMapper.bodyExtractor(err, req)
                            : { error: err.message });
                        res.end();
                        return;
                    }
                }
                res.status(500);
                res.json({ error: "Internal server error" });
                res.end();
            }
        });
    }
}
exports.default = BusinessLogicAndErrorHandling;
//# sourceMappingURL=BusinessLogicAndErrorHandling.js.map