import { ActionMessage } from '../ActionMessage';

export class CustomAction extends ActionMessage {
  actionParameters: any;
  microserviceName: string;
  modelName: string;
  actionName: string;

  constructor(microserviceName: string, modelName: string, actionName: string, actionParams?: any) {
    const params = actionParams;
    super(microserviceName, modelName, actionName, params);
    this.actionParameters = params;
    this.microserviceName = microserviceName;
    this.modelName = modelName;
    this.actionName = actionName;
  }
}
