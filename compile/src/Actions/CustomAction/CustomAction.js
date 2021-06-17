"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomAction = void 0;
const ActionMessage_1 = require("../ActionMessage");
class CustomAction extends ActionMessage_1.ActionMessage {
    constructor(username, password, microserviceName, modelName, actionName, requestType, actionParams) {
        const params = actionParams;
        super(username, password, microserviceName, modelName, actionName, requestType, params);
        this.actionParameters = params;
        this.microserviceName = microserviceName;
        this.modelName = modelName;
        this.actionName = actionName;
        this.username = username;
        this.password = password;
        this.requestType = requestType;
    }
}
exports.CustomAction = CustomAction;
