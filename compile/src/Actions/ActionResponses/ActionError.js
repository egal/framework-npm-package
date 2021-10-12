"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionError = void 0;
/**
 * Класс возвращает данные об ошибках с сервера
 */
class ActionError {
    constructor(message, code) {
        this.message = message;
        this.code = code;
    }
    getMessage() {
        return this.message;
    }
}
exports.ActionError = ActionError;
