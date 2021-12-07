// @ts-ignore
import Validator from 'validatorjs';
import { rules } from '../Helpers/ValidationRules';
export let setErrorLang: any = (lang: string) => {
  Validator.useLang(lang);
};

export class ValidationConstructor {
  data: object;
  rules: object | undefined;
  validation: any;
  customMessages: any;

  constructor(data: object, rules: object, customMessages?: any) {
    this.data = data;
    this.rules = rules;
    this.customMessages = customMessages;
    // @ts-ignore
    this.validation = new Validator(this.data, <Validator.Rules>this.rules, this.customMessages);
  }

  async validate() {
    this.validation.passes();
    let errors = [];
    let returnValues = [];
    errors = this.validation.errors.all();
    for (const [key, value] of Object.entries(errors)) {
      let error = {
        field: key,
        //@ts-ignore
        error: value.toString()
      };
      returnValues.push(error);
    }
    if (returnValues.length) {
      return returnValues;
    } else {
      return this.validation.passes();
    }
  }

  createValidationRule(ruleObject: { name: string; callback: any; message?: string }): void {
    // @ts-ignore
    Validator.register(ruleObject.name, ruleObject.callback, ruleObject.message);
  }

  overrideDefaultMessage(rule: string, message: string, lang?: string): any {
    let language;
    lang ? (language = lang) : (language = 'en');
    let messages = Validator.getMessages(language);
    messages[rule] = message;
    Validator.setMessages(language, messages);
  }

  getAllErrorMessages(languageCode: string): any {
    return Validator.getMessages(languageCode);
  }
  getAllAvailableRules(): any {
    return rules;
  }
}
