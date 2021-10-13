"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationConstructor = void 0;
const validatorjs_1 = __importDefault(require("validatorjs"));
const ValidationRules_1 = require("../Helpers/ValidationRules");
require("validatorjs/dist/lang/ru.js");
class ValidationConstructor {
    constructor(data, rules, customMessages) {
        this.data = data;
        this.rules = rules;
        this.customMessages = customMessages;
        this.validation = new validatorjs_1.default(this.data, this.rules, this.customMessages);
        validatorjs_1.default.useLang('ru');
    }
    async validate() {
        this.validation.passes();
        let keys = Object.keys(this.data);
        let errors = [];
        let error;
        for (let i in keys) {
            if (this.validation.errors.first(keys[i])) {
                error = {
                    field: keys[i],
                    error: this.validation.errors.first(keys[i].toString())
                };
                errors.push(error);
            }
        }
        if (errors.length) {
            return errors;
        }
        else {
            return this.validation.passes();
        }
    }
    createValidationRule(name, callback, message) {
        // @ts-ignore
        validatorjs_1.default.register(name, callback, message);
    }
    overrideDefaultMessage(rule, message) {
        let messages = validatorjs_1.default.getMessages('en');
        messages[rule] = message;
        validatorjs_1.default.setMessages('en', messages);
    }
    changeLanguage(languageCode) {
        console.log('change language', validatorjs_1.default.getDefaultLang());
        validatorjs_1.default.useLang('ru');
    }
    getAllErrorMessages(languageCode) {
        return validatorjs_1.default.getMessages(languageCode);
    }
    getAllAvailableRules() {
        return ValidationRules_1.rules;
    }
}
exports.ValidationConstructor = ValidationConstructor;
