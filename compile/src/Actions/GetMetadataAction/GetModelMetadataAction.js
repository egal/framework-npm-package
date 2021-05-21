"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetModelMetadataAction = void 0;
const ActionMessage_1 = require("../ActionMessage");
class GetModelMetadataAction extends ActionMessage_1.ActionMessage {
    constructor(username, password, microserviceName, actionName, modelName) {
        super(username, password, microserviceName, actionName, modelName);
        this.microserviceName = microserviceName;
        this.actionName = actionName;
        this.modelName = modelName;
        this.username = username;
        this.password = password;
    }
}
exports.GetModelMetadataAction = GetModelMetadataAction;
