import { ActionMessage } from '../ActionMessage';
import { GetItemsActionParams } from './GetItemsActionParams';

export class GetItemsAction extends ActionMessage {
  actionParameters: GetItemsActionParams;
  microserviceName: string;
  modelName: string;
  actionName: string;

  constructor(microserviceName: string, modelName: string, actionName: string, actionParams?: any) {
    const params = actionParams ?? new GetItemsActionParams();
    super(microserviceName, actionName, modelName, params);
    this.actionParameters = params;
    this.microserviceName = microserviceName;
    this.modelName = modelName;
    this.actionName = actionName;
  }
}
