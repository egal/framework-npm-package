"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetItemsAction = void 0;
const ActionMessage_1 = require("../ActionMessage");
const GetItemsActionParams_1 = require("./GetItemsActionParams");
class GetItemsAction extends ActionMessage_1.ActionMessage {
    constructor(username, password, microserviceName, modelName, actionName, actionParams) {
        const params = actionParams !== null && actionParams !== void 0 ? actionParams : new GetItemsActionParams_1.GetItemsActionParams();
        super(username, password, microserviceName, modelName, actionName, params);
        this.actionParameters = params;
        this.microserviceName = microserviceName;
        this.modelName = modelName;
        this.actionName = actionName;
        this.username = username;
        this.password = password;
    }
}
exports.GetItemsAction = GetItemsAction;
