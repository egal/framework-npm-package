"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationConstructor = void 0;
// @ts-ignore
const validatorjs_1 = __importDefault(require("validatorjs"));
class ValidationConstructor {
    constructor(data, rules, customMessages) {
        this.data = data;
        this.rules = rules;
        this.customMessages = customMessages;
    }
    async validate() {
        this.validation = new validatorjs_1.default(this.data, this.rules, this.customMessages);
        this.validation.passes();
        // @ts-ignore
        let keys = Object.keys(this.data);
        let errors = [];
        let error;
        for (let i in keys) {
            error = {
                field: keys[i],
                passed: this.validation.errors.first(keys[i].toString())
            };
            errors.push(error);
            console.log(errors, 'errors');
        }
        // @ts-ignore
        console.log(this.validation.errors.all(), 'log first');
        return errors;
    }
    async validateCustom(name, callback, message) {
        console.log('validate custom');
        // @ts-ignore
        this.validation = new validatorjs_1.default.register(name, callback, message);
        this.validation.passes();
    }
}
exports.ValidationConstructor = ValidationConstructor;
