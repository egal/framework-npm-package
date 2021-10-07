"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetModelMetadataAction = void 0;
const ActionMessage_1 = require("../ActionMessage");
class GetModelMetadataAction extends ActionMessage_1.ActionMessage {
    constructor(microserviceName, actionName, modelName) {
        super(microserviceName, actionName, modelName);
        this.microserviceName = microserviceName;
        this.actionName = actionName;
        this.modelName = modelName;
    }
}
exports.GetModelMetadataAction = GetModelMetadataAction;
