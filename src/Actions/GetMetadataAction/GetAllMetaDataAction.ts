import { ActionMessage } from '../ActionMessage';

export class GetAllMetaDataAction extends ActionMessage {
  microserviceName: string;
  actionName: string;
  modelName: string;

  constructor(microserviceName: string, actionName: string, modelName: string) {
    super(microserviceName, actionName, modelName);
    this.microserviceName = microserviceName;
    this.actionName = actionName;
    this.modelName = modelName;
  }
}
