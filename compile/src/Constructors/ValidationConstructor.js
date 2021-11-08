"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationConstructor = exports.setErrorLang = void 0;
const validatorjs_1 = __importDefault(require("validatorjs"));
// import { ErrorMessages } from 'validatorjs';
const ValidationRules_1 = require("../Helpers/ValidationRules");
let setErrorLang = (lang) => {
    validatorjs_1.default.useLang(lang);
};
exports.setErrorLang = setErrorLang;
class ValidationConstructor {
    constructor(data, rules, customMessages) {
        this.data = data;
        this.rules = rules;
        this.customMessages = customMessages;
        // @ts-ignore
        this.validation = new validatorjs_1.default(this.data, this.rules, this.customMessages);
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
    createValidationRule(ruleObject) {
        // @ts-ignore
        validatorjs_1.default.register(ruleObject.name, ruleObject.callback, ruleObject.message);
    }
    overrideDefaultMessage(rule, message, lang) {
        let language;
        lang ? (language = lang) : (language = 'en');
        let messages = validatorjs_1.default.getMessages(language);
        messages[rule] = message;
        validatorjs_1.default.setMessages(language, messages);
    }
    getAllErrorMessages(languageCode) {
        return validatorjs_1.default.getMessages(languageCode);
    }
    getAllAvailableRules() {
        return ValidationRules_1.rules;
    }
}
exports.ValidationConstructor = ValidationConstructor;
