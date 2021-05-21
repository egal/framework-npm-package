"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventObserver = exports.observers = void 0;
exports.observers = [];
class EventObserver {
    setType(type) {
        this.type = type;
    }
    setModel(model) {
        this.modelName = model;
    }
    subscribe(modelName, fn) {
        return exports.observers.findIndex((item) => item.modelName === modelName) === -1 && exports.observers.push({ modelName, fn });
    }
    unsubscribe(modelName) {
        return exports.observers.filter((subscriber) => subscriber.modelName !== modelName);
    }
    broadcast(data, actionName, receivedModelName) {
        exports.observers.forEach((subscriber) => {
            if (subscriber.modelName === receivedModelName) {
                subscriber.fn(data, actionName, receivedModelName);
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
