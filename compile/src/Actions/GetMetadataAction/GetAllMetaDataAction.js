"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllMetaDataAction = void 0;
const ActionMessage_1 = require("../ActionMessage");
class GetAllMetaDataAction extends ActionMessage_1.ActionMessage {
    constructor(microserviceName, actionName, modelName) {
        super(microserviceName, actionName, modelName);
        this.microserviceName = microserviceName;
        this.actionName = actionName;
        this.modelName = modelName;
    }
}
exports.GetAllMetaDataAction = GetAllMetaDataAction;
