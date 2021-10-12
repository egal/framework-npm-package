import { CRUDActionParams } from './CRUDActionParams';
import { ActionMessage } from '../ActionMessage';
import { ActionInterface } from '../Interfaces/ActionInterface';
import { RoutingKeyParams } from '../Interfaces/RoutingKeyParams';

export class CRUDAction extends ActionMessage implements ActionInterface {
  actionParameters: CRUDActionParams;
  microserviceName: string;
  modelName: string;
  actionName: string;
  channelParameters: RoutingKeyParams;

  constructor(
    microserviceName: string,
    modelName: string,
    actionName: string,
    actionParams?: any,
    channelParameters?: any
  ) {
    super(microserviceName, modelName, actionName, actionParams, channelParameters);
    this.actionName = actionName;
    this.actionParameters = actionParams;
    this.microserviceName = microserviceName;
    this.modelName = modelName;
    this.channelParameters = channelParameters;
  }
}
