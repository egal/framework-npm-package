"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetItemsActionParams = void 0;
const GetItemsSortingParams_1 = require("./GetItemsSortingParams");
const GetItemsFilterParams_1 = require("./GetItemsFilterParams");
class GetItemsActionParams {
    constructor() {
        this.withs = [];
        this.filter = [];
        this.order = [];
        this.pagination = null;
        this.id = '';
    }
    /**
     * Функция формирует массив с выбранными пользователем with
     * @param withObj
     */
    with(withObj) {
        if (withObj) {
            Array.isArray(withObj) ? (this.withs = withObj) : this.withs.push(withObj);
        }
        else
            return undefined;
    }
    /**
     * Функция для передачи id в параметры, применяется при запросах getItem, update, delete
     * @param setId
     */
    setId(setId) {
        this.id = setId;
    }
    /**
     * Функция формирования фильтров
     * @param filterObj
     */
    filters(filterObj) {
        const newFilterObj = new GetItemsFilterParams_1.GetItemsFilterParams(filterObj);
        newFilterObj.checkFilterType();
        this.filter = newFilterObj.formFilterObject();
    }
    /**
     * Функция формирования массива сортировок
     * @param orderObj
     */
    orders(orderObj) {
        this.order = new GetItemsSortingParams_1.GetItemsSortingParams().createOrderObj(orderObj);
    }
    setPagination(perPage, page) {
        // @ts-ignore
        this.pagination = { per_page: perPage, page: page };
    }
    /**
     * Функция, формирующая конечный объект параметров запроса
     */
    toObject() {
        return {
            pagination: this.pagination,
            filter: this.filter,
            withs: this.withs,
            order: this.order,
            id: this.id
        };
    }
}
exports.GetItemsActionParams = GetItemsActionParams;
