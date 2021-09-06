"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionResult = void 0;
/**
 * Класс возвращает ответ, полученный сервером
 */
class ActionResult {
    constructor(data, actionName, modelName, actionMessage) {
        this.data = data;
        this.actionName = actionName;
        this.modelName = modelName;
        this.actionMessage = actionMessage;
    }
    getData() {
        return [this.data, this.actionName, this.modelName, this.actionMessage];
    }
}
exports.ActionResult = ActionResult;
