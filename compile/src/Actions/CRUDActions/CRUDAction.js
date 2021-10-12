"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CRUDAction = void 0;
const ActionMessage_1 = require("../ActionMessage");
class CRUDAction extends ActionMessage_1.ActionMessage {
    constructor(microserviceName, modelName, actionName, actionParams, channelParameters) {
        super(microserviceName, modelName, actionName, actionParams, channelParameters);
        this.actionName = actionName;
        this.actionParameters = actionParams;
        this.microserviceName = microserviceName;
        this.modelName = modelName;
        this.channelParameters = channelParameters;
    }
}
exports.CRUDAction = CRUDAction;
