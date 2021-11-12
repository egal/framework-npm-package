"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetItemsSortingParams = void 0;
class GetItemsSortingParams {
    constructor() {
        this.order = [];
    }
    /**
     * Функция формирует массив с выбранными пользователем сортировками для передачи в параметры запроса
     * @param receivedOrderArr
     */
    createOrderObj(receivedOrderArr) {
        if (receivedOrderArr) {
            if (receivedOrderArr.length <= 1) {
                const orderObj = {
                    column: receivedOrderArr[0][0],
                    direction: receivedOrderArr[0][1]
                };
                this.order.push(orderObj);
            }
            else {
                for (const i in receivedOrderArr) {
                    const orderObj = {
                        column: receivedOrderArr[i][0],
                        direction: receivedOrderArr[i][1]
                    };
                    this.order.push(orderObj);
                }
            }
            return this.order;
        }
        else {
            return this.order;
        }
    }
}
exports.GetItemsSortingParams = GetItemsSortingParams;
