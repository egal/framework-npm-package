import Validator, { ErrorMessages } from 'validatorjs';
import { rules } from '../Helpers/ValidationRules';
export let setErrorLang = (lang: string) => {
  Validator.useLang(lang);
};

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

  createValidationRule(ruleObject: {
    name: string;
    callback: (value: string | number | Boolean) => RegExpMatchArray | null;
    message: string;
  }) {
    // @ts-ignore
    Validator.register(ruleObject.name, ruleObject.callback, ruleObject.message);
  }

  overrideDefaultMessage(rule: string, message: string, lang?: string) {
    let language;
    lang ? (language = lang) : (language = 'en');
    let messages = Validator.getMessages(language);
    messages[rule] = message;
    Validator.setMessages(language, messages);
  }

  getAllErrorMessages(languageCode: string) {
    return Validator.getMessages(languageCode);
  }
  getAllAvailableRules() {
    return rules;
  }
}
