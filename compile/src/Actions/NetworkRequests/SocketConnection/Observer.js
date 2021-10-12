"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventObserver = exports.observers = void 0;
exports.observers = [];
class EventObserver {
    constructor() { }
    subscribe(modelName, fn) {
        return (exports.observers.findIndex((item) => item.modelName === modelName) === -1 &&
            exports.observers.push({ modelName, fn }));
    }
    unsubscribe(modelName) {
        return (exports.observers = exports.observers.filter((subscriber) => subscriber.modelName !== modelName));
    }
    broadcast(data, actionName, receivedModelName, actionMessage) {
        exports.observers.forEach((subscriber) => {
            if (subscriber.modelName === receivedModelName) {
                subscriber.fn(data, actionName, receivedModelName, actionMessage);
            }
        });
    }
    broadcastSocketDisconnect(modelName) {
        exports.observers.forEach((subscriber) => {
            if (subscriber.modelName === modelName) {
                subscriber.fn(modelName);
            }
        });
    }
    checkObservers() {
        console.log(exports.observers);
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new EventObserver();
        }
        return this.instance;
    }
}
exports.EventObserver = EventObserver;
