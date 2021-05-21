import { Method } from 'axios';
import { ActionParameters } from './ActionParameters';
import { HttpRequest } from '../NetworkRequests/HttpRequest';
import { SocketRequest } from '../NetworkRequests/SocketRequest';

export interface ActionMessageInterface {
  serviceName: string;
  modelName: string;
  actionName: string;
  actionParameters?: ActionParameters;
  httpMethod: Method;
  httpRequest: HttpRequest;
  socketRequest: SocketRequest;

  axiosConnect(): void;

  socketConnect(): void;
}
