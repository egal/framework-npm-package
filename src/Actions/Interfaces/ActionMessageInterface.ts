import { Method } from 'axios';
import { ActionParameters } from './ActionParameters';
import { HttpRequest } from '../NetworkRequests/HttpRequest';

export interface ActionMessageInterface {
  serviceName: string;
  modelName: string;
  actionName: string;
  actionParameters?: ActionParameters;
  httpMethod: Method;
  httpRequest: HttpRequest;

  axiosConnect(): any;
}
