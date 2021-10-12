"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionStartProcessing = void 0;
/**
 * Класс возвращает сообщение о начале обработки запроса
 */
class ActionStartProcessing {
    constructor(data) {
        this.data = data;
    }
    getData() {
        return this.data;
    }
}
exports.ActionStartProcessing = ActionStartProcessing;
