"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionMessage = void 0;
const HttpRequest_1 = require("./NetworkRequests/HttpRequest");
const SocketRequest_1 = require("./NetworkRequests/SocketRequest");
const Observer_1 = require("./NetworkRequests/SocketConnection/Observer");
const observer = Observer_1.EventObserver.getInstance();
class ActionMessage {
    constructor(userName, password, microserviceName, actionName, modelName, actionParameters, channelParameters) {
        this.userName = userName;
        this.password = password;
        this.serviceName = microserviceName;
        this.modelName = modelName;
        this.actionName = actionName;
        this.actionParameters = actionParameters;
        this.channelParameters = channelParameters;
        this.httpMethod = 'POST';
        this.httpRequest = new HttpRequest_1.HttpRequest();
        this.socketRequest = new SocketRequest_1.SocketRequest(this.userName, this.password, this.serviceName, this.actionName, this.modelName, this.actionParameters, this.channelParameters);
    }
    axiosConnect() {
        this.httpRequest
            .axiosConnect(this.serviceName, this.modelName, this.actionName, this.httpMethod, this.actionParameters)
            .then((response) => {
            let typedResponse = response;
            let action = typedResponse.splice(1, 1).toString();
            let items = typedResponse.splice(0, 1);
            let actionMessage = typedResponse.splice(1, 1);
            observer.broadcast(items, action, typedResponse.toString(), actionMessage[0]);
            return response;
        })
            .catch((error) => {
            observer.broadcast(error, 'error', this.modelName);
            return error;
        });
    }
    socketConnect() {
        this.socketRequest.initSocketConnect();
    }
}
exports.ActionMessage = ActionMessage;
