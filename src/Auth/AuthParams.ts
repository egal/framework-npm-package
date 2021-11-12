import { ActionParameters } from '../Actions/Interfaces/ActionParameters';

export class AuthParams implements ActionParameters {
  parameters: ActionParameters | undefined;
  constructor() {}

  setAuthParams(params: ActionParameters | undefined): any {
    this.parameters = params;
    return this.parameters;
  }

  toObject(): any {
    return { parameters: this.parameters };
  }
}
