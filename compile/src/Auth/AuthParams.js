"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthParams = void 0;
class AuthParams {
    constructor() { }
    setAuthParams(params) {
        this.parameters = params;
        return this.parameters;
    }
    toObject() {
        return { parameters: this.parameters };
    }
}
exports.AuthParams = AuthParams;
