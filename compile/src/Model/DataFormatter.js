"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataFormatter = void 0;
class DataFormatter {
    constructor(receivedData, allItems) {
        this.receivedData = receivedData;
        this.formattedData = [];
        this.allItems = allItems.items;
    }
}
exports.DataFormatter = DataFormatter;
