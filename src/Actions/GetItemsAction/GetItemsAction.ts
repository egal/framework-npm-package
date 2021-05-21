import { ActionMessage } from '../ActionMessage';
import { GetItemsActionParams } from './GetItemsActionParams';

export class GetItemsAction extends ActionMessage {
  actionParameters: GetItemsActionParams;
  microserviceName: string;
  modelName: string;
  actionName: string;
  username: string;
  password: string;

  constructor(username: string, password: string, microserviceName: string, modelName: string, actionName: string, actionParams?: any) {
    const params = actionParams ?? new GetItemsActionParams();
    super(username, password, microserviceName, modelName, actionName, params);
    this.actionParameters = params;
    this.microserviceName = microserviceName;
    this.modelName = modelName;
    this.actionName = actionName;
    this.username = username;
    this.password = password;
  }
}
