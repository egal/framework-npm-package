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
        var _a, _b, _c, _d, _e;
        let filterAll = [];
        let filterAllLeft = [];
        let filterAllRight = [];
        let temporalFilterArrLeft = [];
        let temporalFilterArrRight = [];
        let multiFilterFieldLeft;
        let multiFilterFieldRight;
        let leftComplexFilter = [];
        let rightComplexFilter = [];
        if ((filterItem === null || filterItem === void 0 ? void 0 : filterItem.left) && !((_a = filterItem.left) === null || _a === void 0 ? void 0 : _a.left) && !((_b = filterItem.right) === null || _b === void 0 ? void 0 : _b.left)) {
            if (Array.isArray(filterItem.left.value)) {
                filterItem.left.value.forEach((valueItem) => {
                    temporalFilterArrLeft = [filterItem.left.field, filterItem.left.operator, valueItem];
                    filterAllLeft.push(temporalFilterArrLeft);
                });
                multiFilterFieldLeft = filterAllLeft
                    .map((e, i) => (i < filterAllLeft.length - 1 ? [e, 'OR'] : [e]))
                    .reduce((a, b) => a.concat(b));
                leftComplexFilter.push(multiFilterFieldLeft);
            }
            else {
                leftComplexFilter = [
                    filterItem.left.field,
                    filterItem.left.operator,
                    filterItem.left.value
                ];
            }
            if (Array.isArray(filterItem.right.value)) {
                filterItem.right.value.forEach((valueItem) => {
                    temporalFilterArrRight = [filterItem.right.field, filterItem.right.operator, valueItem];
                    filterAllRight.push(temporalFilterArrRight);
                });
                multiFilterFieldRight = filterAllRight
                    .map((e, i) => (i < filterAllRight.length - 1 ? [e, 'OR'] : [e]))
                    .reduce((a, b) => a.concat(b));
                rightComplexFilter.push(multiFilterFieldRight);
            }
            else {
                rightComplexFilter = [
                    filterItem.right.field,
                    filterItem.right.operator,
                    filterItem.right.value
                ];
            }
            this.defaultFilterArr = [leftComplexFilter, filterItem.type, rightComplexFilter];
            if (((_c = this.userFilterInput) === null || _c === void 0 ? void 0 : _c.length) === 1) {
                this.tempArr = this.defaultFilterArr;
            }
            else {
                this.tempArr.push(this.defaultFilterArr);
            }
        }
        else if (((_d = filterItem.left) === null || _d === void 0 ? void 0 : _d.left) || ((_e = filterItem.right) === null || _e === void 0 ? void 0 : _e.left)) {
            if (filterItem.left.left && !filterItem.right.left) {
                this.formComplexLeftNestedFilter(filterItem);
            }
            if (!filterItem.left.left && filterItem.right.left) {
                this.formComplexRightNestedValue(filterItem);
            }
            if (filterItem.left.left && filterItem.right.left) {
            }
        }
        else if (Array.isArray(filterItem.value)) {
            filterItem.value.forEach((valueItem) => {
                this.defaultFilterArr = [filterItem.field, filterItem.operator, valueItem];
                filterAll.push(this.defaultFilterArr);
            });
            this.multiFilterField = filterAll
                .map((e, i) => (i < filterAll.length - 1 ? [e, 'OR'] : [e]))
                .reduce((a, b) => a.concat(b));
            this.tempArr.push(this.multiFilterField);
        }
        else if (Array.isArray(filterItem)) {
            this.tempArr.push(filterItem);
        }
        else {
            this.defaultFilterArr = [filterItem.field, filterItem.operator, filterItem.value];
            this.tempArr.push(this.defaultFilterArr);
        }
    }
    formComplexLeftNestedFilter(filterItem) {
        var _a;
        let filterAllLeft = [];
        let filterAllRight = [];
        let filterAllRightPart = [];
        let leftComplexFilter = [];
        let rightComplexFilter = [];
        let rightFilterPart = [];
        let temporalLeftFilterArr = [];
        let temporalRightFilterArr = [];
        let temporalFilterArr = [];
        let multiFilterLeftField;
        let multiFilterRightField;
        let multiFilterNestedRightField;
        let defaultNestedFilterArr = [];
        if (Array.isArray(filterItem.left.left.value)) {
            filterItem.left.left.value.forEach((valueItem) => {
                temporalLeftFilterArr = [
                    filterItem.left.left.field,
                    filterItem.left.left.operator,
                    valueItem
                ];
                filterAllLeft.push(temporalLeftFilterArr);
            });
            multiFilterLeftField = filterAllLeft
                .map((e, i) => (i < filterAllLeft.length - 1 ? [e, 'OR'] : [e]))
                .reduce((a, b) => a.concat(b));
            leftComplexFilter.push(multiFilterLeftField);
        }
        else {
            leftComplexFilter = [
                filterItem.left.left.field,
                filterItem.left.left.operator,
                filterItem.left.left.value
            ];
        }
        if (Array.isArray(filterItem.left.right.value)) {
            filterItem.left.right.value.forEach((valueItem) => {
                temporalRightFilterArr = [
                    filterItem.left.right.field,
                    filterItem.left.right.operator,
                    valueItem
                ];
                filterAllRight.push(temporalRightFilterArr);
            });
            multiFilterNestedRightField = filterAllRight
                .map((e, i) => (i < filterAllRight.length - 1 ? [e, 'OR'] : [e]))
                .reduce((a, b) => a.concat(b));
            rightComplexFilter.push(multiFilterNestedRightField);
        }
        else {
            rightComplexFilter = [
                filterItem.left.right.field,
                filterItem.left.right.operator,
                filterItem.left.right.value
            ];
        }
        if (Array.isArray(filterItem.right.value)) {
            filterItem.right.value.forEach((valueItem) => {
                temporalFilterArr = [filterItem.right.field, filterItem.right.operator, valueItem];
                filterAllRightPart.push(temporalFilterArr);
            });
            multiFilterRightField = filterAllRightPart
                .map((e, i) => (i < filterAllRightPart.length - 1 ? [e, 'OR'] : [e]))
                .reduce((a, b) => a.concat(b));
            rightFilterPart.push(multiFilterRightField);
        }
        else {
            rightFilterPart = [filterItem.right.field, filterItem.right.operator, filterItem.right.value];
        }
        defaultNestedFilterArr = [leftComplexFilter, filterItem.left.type, rightComplexFilter];
        this.defaultFilterArr = [defaultNestedFilterArr, filterItem.type, rightFilterPart];
        if (((_a = this.userFilterInput) === null || _a === void 0 ? void 0 : _a.length) === 1) {
            this.tempArr = this.defaultFilterArr;
        }
        else {
            this.tempArr.push([this.defaultFilterArr]);
        }
    }
    formComplexRightNestedValue(filterItem) {
        var _a;
        let filterAllLeft = [];
        let filterAllRight = [];
        let filterAllLeftPart = [];
        let leftComplexFilter = [];
        let rightComplexFilter = [];
        let leftFilterPart = [];
        let temporalLeftFilterArr = [];
        let temporalRightFilterArr = [];
        let temporalFilterArr = [];
        let multiFilterLeftField;
        let multiFilterRightField;
        let multiFilterNestedLeftField;
        let defaultNestedFilterArr = [];
        if (Array.isArray(filterItem.right.left.value)) {
            filterItem.right.left.value.forEach((valueItem) => {
                temporalLeftFilterArr = [
                    filterItem.right.left.field,
                    filterItem.right.left.operator,
                    valueItem
                ];
                filterAllLeft.push(temporalLeftFilterArr);
            });
            multiFilterLeftField = filterAllLeft
                .map((e, i) => (i < filterAllLeft.length - 1 ? [e, 'OR'] : [e]))
                .reduce((a, b) => a.concat(b));
            leftComplexFilter.push(multiFilterLeftField);
        }
        else {
            leftComplexFilter = [
                filterItem.right.left.field,
                filterItem.right.left.operator,
                filterItem.right.left.value
            ];
        }
        if (Array.isArray(filterItem.right.right.value)) {
            filterItem.right.right.value.forEach((valueItem) => {
                temporalRightFilterArr = [
                    filterItem.right.right.field,
                    filterItem.right.right.operator,
                    valueItem
                ];
                filterAllRight.push(temporalRightFilterArr);
            });
            multiFilterRightField = filterAllRight
                .map((e, i) => (i < filterAllRight.length - 1 ? [e, 'OR'] : [e]))
                .reduce((a, b) => a.concat(b));
            rightComplexFilter.push(multiFilterRightField);
        }
        else {
            rightComplexFilter = [
                filterItem.right.right.field,
                filterItem.right.right.operator,
                filterItem.right.right.value
            ];
        }
        if (Array.isArray(filterItem.left.value)) {
            filterItem.left.value.forEach((valueItem) => {
                temporalFilterArr = [filterItem.left.field, filterItem.left.operator, valueItem];
                filterAllLeftPart.push(temporalFilterArr);
            });
            multiFilterNestedLeftField = filterAllLeftPart
                .map((e, i) => (i < filterAllLeftPart.length - 1 ? [e, 'OR'] : [e]))
                .reduce((a, b) => a.concat(b));
            leftFilterPart.push(multiFilterNestedLeftField);
        }
        else {
            leftFilterPart = [filterItem.left.field, filterItem.left.operator, filterItem.left.value];
        }
        defaultNestedFilterArr = [leftComplexFilter, filterItem.right.type, rightComplexFilter];
        this.defaultFilterArr = [leftFilterPart, filterItem.type, defaultNestedFilterArr];
        if (((_a = this.userFilterInput) === null || _a === void 0 ? void 0 : _a.length) === 1) {
            this.tempArr = this.defaultFilterArr;
        }
        else {
            this.tempArr.push([this.defaultFilterArr]);
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
