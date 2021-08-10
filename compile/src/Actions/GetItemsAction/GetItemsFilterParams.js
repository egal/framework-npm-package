"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetItemsFilterParams = void 0;
class GetItemsFilterParams {
    constructor(filterObj) {
        this.filter = [];
        this.tempArr = [];
        this.userFilterInput = filterObj;
    }
    /**
     * Функция разбирает массив с фильтрами, полученный от пользователя
     * и передает каждый айтем в след. функцию
     */
    checkFilterType() {
        if (this.userFilterInput) {
            this.userFilterInput.forEach((item) => {
                this.createDefaultObjectInstance(item);
            });
        }
    }
    /**
     * Функция формирует массив с условиями для одного фильтра
     * @param filterItem
     */
    createDefaultObjectInstance(filterItem) {
        var _a;
        let defaultFilterArr;
        let leftArrPart;
        let rightArrPart;
        let filterAll = [];
        let multiFilterField;
        if (filterItem === null || filterItem === void 0 ? void 0 : filterItem.left) {
            leftArrPart = [filterItem.left.field, filterItem.left.operator, filterItem.left.value];
            rightArrPart = [filterItem.right.field, filterItem.right.operator, filterItem.right.value];
            defaultFilterArr = [leftArrPart, filterItem.type, rightArrPart];
            if (((_a = this.userFilterInput) === null || _a === void 0 ? void 0 : _a.length) === 1) {
                this.tempArr = defaultFilterArr;
            }
            else {
                this.tempArr.push(defaultFilterArr);
            }
        }
        else if (Array.isArray(filterItem.value)) {
            filterItem.value.forEach((valueItem) => {
                defaultFilterArr = [filterItem.field, filterItem.operator, valueItem];
                filterAll.push(defaultFilterArr);
            });
            multiFilterField = filterAll.map((e, i) => (i < filterAll.length - 1 ? [e, 'OR'] : [e]))
                .reduce((a, b) => a.concat(b));
            this.tempArr.push(multiFilterField);
        }
        else {
            defaultFilterArr = [filterItem.field, filterItem.operator, filterItem.value];
            this.tempArr.push(defaultFilterArr);
        }
    }
    /**
     * Функция формирует массив из всех примененных фильтров для отправки в запросе
     */
    formFilterObject() {
        var _a;
        // @ts-ignore
        if (this.tempArr.length > 1 && ((_a = this.userFilterInput) === null || _a === void 0 ? void 0 : _a.length) > 1) {
            this.filter = this.tempArr
                .map((e, i) => (i < this.tempArr.length - 1 ? [e, 'AND'] : [e]))
                .reduce((a, b) => a.concat(b));
            return this.filter;
        }
        else {
            this.filter = this.tempArr;
            return this.filter;
        }
    }
}
exports.GetItemsFilterParams = GetItemsFilterParams;
