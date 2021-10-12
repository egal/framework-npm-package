// @ts-ignore
import Validator, { ErrorMessages } from 'validatorjs';
export class ValidationConstructor {
  data: object | undefined;
  rules: object | undefined;
  validation: any;
  customMessages: ErrorMessages | undefined;
  constructor(data?: object, rules?: object, customMessages?: ErrorMessages) {
    this.data = data;
    this.rules = rules;
    this.customMessages = customMessages;
  }

  async validate() {
    this.validation = new Validator(this.data, <Validator.Rules>this.rules, this.customMessages);
    this.validation.passes();
    // @ts-ignore
    let keys = Object.keys(this.data);
    let errors = [];
    let error: { field: string; passed: Boolean };
    for (let i in keys) {
      error = {
        field: keys[i],
        passed: this.validation.errors.first(keys[i].toString())
      };
      errors.push(error);
      console.log(errors);
    }
    // @ts-ignore
    console.log(this.validation.errors.all(), 'log first');
    return errors;
  }
  async validateCustom(name: string, callback: Function, message: string) {
    console.log('validate custom');
    // @ts-ignore
    this.validation = new Validator.register(name, callback, message);
  }
}
