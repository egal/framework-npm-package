"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionResult = void 0;
/**
 * Класс возвращает ответ, полученный сервером
 */
class ActionResult {
    constructor(data, actionName, modelName) {
        this.data = data;
        this.actionName = actionName;
        this.modelName = modelName;
    }
    getData() {
        return [this.data, this.actionName, this.modelName];
    }
}
exports.ActionResult = ActionResult;
