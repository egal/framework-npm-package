"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataFormatter = void 0;
class DataFormatter {
    constructor(receivedData, allItems) {
        this.receivedData = receivedData;
        this.formattedData = [];
        this.allItems = allItems.items;
    }
    /**
     * функция фильтрует список айтемов и оставляет только указанные пользователем поля
     */
    include() {
        for (const i in this.allItems) {
            this.formattedData.push(Object.fromEntries(Object.entries(this.allItems[i]).filter(([key, val]) => this.receivedData.includes(key))));
        }
        return this.formattedData;
    }
    /**
     * функция фильтрует список айтемов и удаляет только указанные пользователем поля
     *
     * Функции почти одинаковые, но я решила их разделить чтобы было лучше понятно что для чего используется
     */
    exclude() {
        for (const i in this.allItems) {
            this.formattedData.push(Object.fromEntries(Object.entries(this.allItems[i]).filter(([key, val]) => !this.receivedData.includes(key))));
        }
        return this.formattedData;
    }
}
exports.DataFormatter = DataFormatter;
