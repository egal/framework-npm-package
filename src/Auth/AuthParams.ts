import { ActionParameters } from "../Actions/Interfaces/ActionParameters";

export class AuthParams implements ActionParameters {
  parameters: ActionParameters | undefined;
  constructor() {}

  setAuthParams(params: ActionParameters | undefined) {
    this.parameters = params;
    return this.parameters;
  }

  toObject() {
    return { parameters: this.parameters };
  }
}
