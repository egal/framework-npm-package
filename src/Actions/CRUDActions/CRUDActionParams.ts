import { ActionParameters } from '../Interfaces/ActionParameters';

export class CRUDActionParams implements ActionParameters {
  data: object = {};

  toObject(): object {
    return {
      ...this.data
    };
  }
}
