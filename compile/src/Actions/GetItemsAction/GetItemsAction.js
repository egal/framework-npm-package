"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetItemsAction = void 0;
const ActionMessage_1 = require("../ActionMessage");
const GetItemsActionParams_1 = require("./GetItemsActionParams");
class GetItemsAction extends ActionMessage_1.ActionMessage {
    constructor(microserviceName, modelName, actionName, actionParams) {
        const params = actionParams !== null && actionParams !== void 0 ? actionParams : new GetItemsActionParams_1.GetItemsActionParams();
        super(microserviceName, actionName, modelName, params);
        this.actionParameters = params;
        this.microserviceName = microserviceName;
        this.modelName = modelName;
        this.actionName = actionName;
    }
}
exports.GetItemsAction = GetItemsAction;
