import { Method } from 'axios';
import { ActionParameters } from './Interfaces/ActionParameters';
import { HttpRequest } from './NetworkRequests/HttpRequest';
import { ActionMessageInterface } from './Interfaces/ActionMessageInterface';
import { EventObserver } from './NetworkRequests/SocketConnection/Observer';
import { RoutingKeyParams } from './Interfaces/RoutingKeyParams';

const observer: EventObserver = EventObserver.getInstance();

export class ActionMessage implements ActionMessageInterface {
  serviceName: string;
  modelName: string;
  actionName: string;
  httpMethod: Method;
  httpRequest: HttpRequest;
  channelParameters: RoutingKeyParams;
  actionParameters?: ActionParameters;

  constructor(
    microserviceName: string,
    actionName: string,
    modelName: string,
    actionParameters?: ActionParameters,
    channelParameters?: any
  ) {
    this.serviceName = microserviceName;
    this.modelName = modelName;
    this.actionName = actionName;
    this.actionParameters = actionParameters;
    this.channelParameters = channelParameters;
    this.httpMethod = 'POST';
    this.httpRequest = new HttpRequest();
  }

  axiosConnect(constructorRequest?: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpRequest
        .axiosConnect(
          this.serviceName,
          this.modelName,
          this.actionName,
          this.httpMethod,
          this.actionParameters
        )
        .then((response: any) => {
          let action = response.data.action.action_name;
          let items = response.data.action_result.data;
          let actionMessage = response.data.action_result.action_message;
          let modelName = response.data.action.model_name;
          constructorRequest
            ? resolve(response.data.action_result.data)
            : observer.broadcast(items, action, modelName, actionMessage);
        })
        .catch((error) => {
          let returnError
          if('data' in error) {
            if('action_error' in error.data) {
              returnError = error.data.action_error
            }
          } else {
            returnError = error
          }
          constructorRequest
            ? reject(returnError)
            : observer.broadcast(error, 'error', this.modelName);
        });
    });
  }
}
