import {Method} from 'axios';
import {ActionParameters} from './Interfaces/ActionParameters';
import {HttpRequest} from './NetworkRequests/HttpRequest';
import {SocketRequest} from './NetworkRequests/SocketRequest';
import {ActionMessageInterface} from './Interfaces/ActionMessageInterface';
import {EventObserver} from './NetworkRequests/SocketConnection/Observer';
import {RoutingKeyParams} from "./Interfaces/RoutingKeyParams";

const observer = new EventObserver();

export class ActionMessage implements ActionMessageInterface {
    userName: string;
    password: string;
    serviceName: string;
    modelName: string;
    actionName: string;
    httpMethod: Method;
    httpRequest: HttpRequest;
    socketRequest: SocketRequest;
    channelParameters: RoutingKeyParams;
    actionParameters?: ActionParameters;

    constructor(
        userName: string,
        password: string,
        microserviceName: string,
        actionName: string,
        modelName: string,
        actionParameters?: ActionParameters,
        channelParameters?: any
    ) {
        this.userName = userName;
        this.password = password;
        this.serviceName = microserviceName;
        this.modelName = modelName;
        this.actionName = actionName;
        this.actionParameters = actionParameters;
        this.channelParameters = channelParameters;
        this.httpMethod = 'POST';
        this.httpRequest = new HttpRequest();
        this.socketRequest = new SocketRequest(
            this.userName,
            this.password,
            this.serviceName,
            this.actionName,
            this.modelName,
            this.actionParameters,
            this.channelParameters
        );
    }

    axiosConnect() {
        this.httpRequest
            .axiosConnect(
                this.serviceName,
                this.modelName,
                this.actionName,
                this.httpMethod,
                this.actionParameters
            )
            .then((response) => {
                let typedResponse: (string | object)[] = response as (string | object)[];
                let action = typedResponse.splice(1, 1).toString();
                let items = typedResponse.splice(0, 1);
                observer.broadcast(items, action, typedResponse.toString());
                return response;
            })
            .catch((error) => {
                observer.broadcast(error, 'error');
                return error;
            });
    }

    socketConnect() {
        this.socketRequest.initSocketConnect();
    }

    socketDisconnect() {
        this.socketRequest.socketDisconnect()
    }
}
