"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CRUDActionParams = void 0;
class CRUDActionParams {
    constructor() {
        this.data = {};
    }
    toObject() {
        return {
            ...this.data
        };
    }
}
exports.CRUDActionParams = CRUDActionParams;
