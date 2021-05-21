import { ActionMessage } from '../ActionMessage';

export class GetAllMetaDataAction extends ActionMessage {
  microserviceName: string;
  actionName: string;
  modelName: string;
  username: string;
  password: string

  constructor(username:string, password:string, microserviceName: string, actionName: string, modelName: string) {
    super(username, password, microserviceName, actionName, modelName);
    this.microserviceName = microserviceName;
    this.actionName = actionName;
    this.modelName = modelName;
    this.username = username;
    this.password = password
  }
}
