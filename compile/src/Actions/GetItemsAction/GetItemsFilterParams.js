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
        var _a, _b, _c, _d, _e, _f, _g, _h;
        let defaultFilterArr;
        let defaultNestedFilterArr;
        let leftArrPart;
        let nestedLeftArrPart;
        let rightArrPart;
        let nestedRightArrPart;
        let filterAll = [];
        let multiFilterField;
        // @ts-ignore
        if ((filterItem === null || filterItem === void 0 ? void 0 : filterItem.left) && !((_a = filterItem.left) === null || _a === void 0 ? void 0 : _a.left) && !((_b = filterItem.right) === null || _b === void 0 ? void 0 : _b.left)) {
            leftArrPart = [filterItem.left.field, filterItem.left.operator, filterItem.left.value];
            rightArrPart = [filterItem.right.field, filterItem.right.operator, filterItem.right.value];
            defaultFilterArr = [leftArrPart, filterItem.type, rightArrPart];
            if (((_c = this.userFilterInput) === null || _c === void 0 ? void 0 : _c.length) === 1) {
                this.tempArr = defaultFilterArr;
            }
            else {
                this.tempArr.push(defaultFilterArr);
            }
            // @ts-ignore
        }
        else if (((_d = filterItem.left) === null || _d === void 0 ? void 0 : _d.left) || ((_e = filterItem.right) === null || _e === void 0 ? void 0 : _e.left)) {
            // @ts-ignore
            if (filterItem.left.left && !filterItem.right.left) {
                // @ts-ignore
                nestedLeftArrPart = [filterItem.left.left.field, filterItem.left.left.operator, filterItem.left.left.value];
                // @ts-ignore
                nestedRightArrPart = [filterItem.left.right.field, filterItem.left.right.operator, filterItem.left.right.value];
                // @ts-ignore
                defaultNestedFilterArr = [nestedLeftArrPart, filterItem.left.type, nestedRightArrPart];
                rightArrPart = [filterItem.right.field, filterItem.right.operator, filterItem.right.value];
                defaultFilterArr = [defaultNestedFilterArr, filterItem.type, rightArrPart];
                if (((_f = this.userFilterInput) === null || _f === void 0 ? void 0 : _f.length) === 1) {
                    this.tempArr = defaultFilterArr;
                }
                else {
                    this.tempArr.push(defaultFilterArr);
                }
            }
            // @ts-ignore
            if (!filterItem.left.left && filterItem.right.left) {
                // @ts-ignore
                nestedLeftArrPart = [filterItem.right.left.field, filterItem.right.left.operator, filterItem.right.left.value];
                // @ts-ignore
                nestedRightArrPart = [filterItem.right.right.field, filterItem.right.right.operator, filterItem.right.right.value];
                // @ts-ignore
                defaultNestedFilterArr = [nestedLeftArrPart, filterItem.right.type, nestedRightArrPart];
                leftArrPart = [filterItem.left.field, filterItem.left.operator, filterItem.left.value];
                defaultFilterArr = [leftArrPart, filterItem.type, defaultNestedFilterArr];
                if (((_g = this.userFilterInput) === null || _g === void 0 ? void 0 : _g.length) === 1) {
                    this.tempArr = defaultFilterArr;
                }
                else {
                    this.tempArr.push(defaultFilterArr);
                }
            }
            // @ts-ignore
            if (filterItem.left.left && filterItem.right.left) {
                // @ts-ignore
                nestedLeftArrPart = [[filterItem.left.left.field, filterItem.left.left.operator, filterItem.left.left.value], filterItem.left.type, [filterItem.left.right.field, filterItem.left.right.operator, filterItem.left.right.value]
                ];
                // @ts-ignore
                nestedRightArrPart = [[filterItem.right.left.field, filterItem.right.left.operator, filterItem.right.left.value], filterItem.right.type, [filterItem.right.right.field, filterItem.right.right.operator, filterItem.right.right.value]
                ];
                defaultFilterArr = [nestedLeftArrPart, filterItem.type, nestedRightArrPart];
                if (((_h = this.userFilterInput) === null || _h === void 0 ? void 0 : _h.length) === 1) {
                    this.tempArr = defaultFilterArr;
                }
                else {
                    this.tempArr.push(defaultFilterArr);
                }
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
