"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionMessage = void 0;
const HttpRequest_1 = require("./NetworkRequests/HttpRequest");
const SocketRequest_1 = require("./NetworkRequests/SocketRequest");
const Observer_1 = require("./NetworkRequests/SocketConnection/Observer");
const observer = Observer_1.EventObserver.getInstance();
class ActionMessage {
    constructor(microserviceName, actionName, modelName, actionParameters, channelParameters) {
        this.serviceName = microserviceName;
        this.modelName = modelName;
        this.actionName = actionName;
        this.actionParameters = actionParameters;
        this.channelParameters = channelParameters;
        this.httpMethod = 'POST';
        this.httpRequest = new HttpRequest_1.HttpRequest();
        this.socketRequest = new SocketRequest_1.SocketRequest(this.serviceName, this.actionName, this.modelName, this.actionParameters, this.channelParameters);
    }
    axiosConnect(constructorRequest) {
        return new Promise((resolve, reject) => {
            this.httpRequest
                .axiosConnect(this.serviceName, this.modelName, this.actionName, this.httpMethod, this.actionParameters)
                .then((response) => {
                let action = response.data.action.action_name;
                let items = response.data.action_result.data;
                let actionMessage = response.data.action_result.action_message;
                let modelName = response.data.action.model_name;
                constructorRequest
                    ? resolve(response.data.action_result.data)
                    : observer.broadcast(items, action, modelName, actionMessage);
            })
                .catch((error) => {
                constructorRequest
                    ? reject(error.data.action_error)
                    : observer.broadcast(error, 'error', this.modelName);
            });
        });
    }
    socketConnect() {
        this.socketRequest.initSocketConnect();
    }
}
exports.ActionMessage = ActionMessage;
