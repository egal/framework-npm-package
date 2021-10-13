import Validator, { ErrorMessages, RegisterCallback } from 'validatorjs';
import { rules } from '../Helpers/ValidationRules';
import 'validatorjs/dist/lang/ru.js';
export class ValidationConstructor {
  data: object;
  rules: object | undefined;
  validation: any;
  customMessages: ErrorMessages | undefined;

  constructor(data: object, rules: object, customMessages?: ErrorMessages) {
    this.data = data;
    this.rules = rules;
    this.customMessages = customMessages;
    this.validation = new Validator(this.data, <Validator.Rules>this.rules, this.customMessages);
    Validator.useLang('ru');
  }

  async validate() {
    this.validation.passes();
    let keys = Object.keys(this.data);
    let errors = [];
    let error: { field: string; error: Boolean };
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
    } else {
      return this.validation.passes();
    }
  }

  createValidationRule(
    name: string,
    callback: (value: string | number | Boolean) => RegExpMatchArray | null,
    message: string
  ) {
    // @ts-ignore
    Validator.register(name, callback, message);
  }

  overrideDefaultMessage(rule: string, message: string) {
    let messages = Validator.getMessages('en');
    messages[rule] = message;
    Validator.setMessages('en', messages);
  }

  changeLanguage(languageCode: string) {
    console.log('change language', Validator.getDefaultLang());
    Validator.useLang('ru');
  }

  getAllErrorMessages(languageCode: string) {
    return Validator.getMessages(languageCode);
  }
  getAllAvailableRules() {
    return rules;
  }
}
