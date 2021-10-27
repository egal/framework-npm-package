"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationConstructor = exports.setErrorLang = void 0;
// import Validator, { ErrorMessages } from 'validatorjs';
const Validator = __importStar(require("validatorjs"));
const ValidationRules_1 = require("../Helpers/ValidationRules");
let setErrorLang = (lang) => {
    Validator.useLang(lang);
};
exports.setErrorLang = setErrorLang;
class ValidationConstructor {
    constructor(data, rules, customMessages) {
        this.data = data;
        this.rules = rules;
        this.customMessages = customMessages;
        // @ts-ignore
        this.validation = new Validator(this.data, this.rules, this.customMessages);
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
        Validator.register(ruleObject.name, ruleObject.callback, ruleObject.message);
    }
    overrideDefaultMessage(rule, message, lang) {
        let language;
        lang ? (language = lang) : (language = 'en');
        let messages = Validator.getMessages(language);
        messages[rule] = message;
        Validator.setMessages(language, messages);
    }
    getAllErrorMessages(languageCode) {
        return Validator.getMessages(languageCode);
    }
    getAllAvailableRules() {
        return ValidationRules_1.rules;
    }
}
exports.ValidationConstructor = ValidationConstructor;
