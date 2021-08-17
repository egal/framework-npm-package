export class GetItemsFilterParams {
    filter: (string | object)[];
    tempArr: (string | object)[];
    userFilterInput: (string | object)[] | undefined;

    constructor(filterObj: (string | object)[] | undefined) {
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
            this.userFilterInput.forEach((item: any) => {
                this.createDefaultObjectInstance(item);
            });
        }
    }

    /**
     * Функция формирует массив с условиями для одного фильтра
     * @param filterItem
     */
    createDefaultObjectInstance(filterItem: {
        left: {
            field: string;
            operator: string;
            value?: string | number;
        };
        type: string;
        right: {
            field: string;
            operator: string;
            value?: string | number;
        };
        forEach(param: (item: any) => void): void;
        field: string;
        operator: string;
        value?: string | number | object;
    }) {
        let defaultFilterArr;
        let defaultNestedFilterArr;
        let leftArrPart;
        let nestedLeftArrPart;
        let rightArrPart;
        let nestedRightArrPart;
        let filterAll: any[][] = [];
        let multiFilterField;
        // @ts-ignore
        if (filterItem?.left && !filterItem.left?.left && !filterItem.right?.left) {
            leftArrPart = [filterItem.left.field, filterItem.left.operator, filterItem.left.value];
            rightArrPart = [filterItem.right.field, filterItem.right.operator, filterItem.right.value];
            defaultFilterArr = [leftArrPart, filterItem.type, rightArrPart];
            if (this.userFilterInput?.length === 1) {
                this.tempArr = defaultFilterArr;
            } else {
                this.tempArr.push(defaultFilterArr);
            }
            // @ts-ignore
        } else if (filterItem.left?.left || filterItem.right?.left) {
            // @ts-ignore
            if (filterItem.left.left && !filterItem.right.left) {
                // @ts-ignore
                nestedLeftArrPart = [filterItem.left.left.field, filterItem.left.left.operator, filterItem.left.left.value];
                // @ts-ignore
                nestedRightArrPart = [filterItem.left.right.field, filterItem.left.right.operator, filterItem.left.right.value]
                // @ts-ignore
                defaultNestedFilterArr = [nestedLeftArrPart, filterItem.left.type, nestedRightArrPart]
                rightArrPart = [filterItem.right.field, filterItem.right.operator, filterItem.right.value];
                defaultFilterArr = [defaultNestedFilterArr, filterItem.type, rightArrPart];
                if (this.userFilterInput?.length === 1) {
                    this.tempArr = defaultFilterArr;
                } else {
                    this.tempArr.push(defaultFilterArr);
                }
            }
            // @ts-ignore
            if (!filterItem.left.left && filterItem.right.left) {
                // @ts-ignore
                nestedLeftArrPart = [filterItem.right.left.field, filterItem.right.left.operator, filterItem.right.left.value];
                // @ts-ignore
                nestedRightArrPart = [filterItem.right.right.field, filterItem.right.right.operator, filterItem.right.right.value]
                // @ts-ignore
                defaultNestedFilterArr = [nestedLeftArrPart, filterItem.right.type, nestedRightArrPart]
                leftArrPart = [filterItem.left.field, filterItem.left.operator, filterItem.left.value];
                defaultFilterArr = [leftArrPart, filterItem.type, defaultNestedFilterArr];
                if (this.userFilterInput?.length === 1) {
                    this.tempArr = defaultFilterArr;
                } else {
                    this.tempArr.push(defaultFilterArr);
                }
            }
            // @ts-ignore
            if (filterItem.left.left && filterItem.right.left) {
                // @ts-ignore
                nestedLeftArrPart = [[filterItem.left.left.field, filterItem.left.left.operator, filterItem.left.left.value], filterItem.left.type, [filterItem.left.right.field, filterItem.left.right.operator, filterItem.left.right.value]
                ]
                // @ts-ignore
                nestedRightArrPart = [[filterItem.right.left.field, filterItem.right.left.operator, filterItem.right.left.value], filterItem.right.type, [filterItem.right.right.field, filterItem.right.right.operator, filterItem.right.right.value]
                ]
                defaultFilterArr = [nestedLeftArrPart, filterItem.type, nestedRightArrPart];
                if (this.userFilterInput?.length === 1) {
                    this.tempArr = defaultFilterArr;
                } else {
                    this.tempArr.push(defaultFilterArr);
                }
            }
        } else if (Array.isArray(filterItem.value)) {
            filterItem.value.forEach((valueItem) => {
                defaultFilterArr = [filterItem.field, filterItem.operator, valueItem]
                filterAll.push(defaultFilterArr)
            })
            multiFilterField = filterAll.map((e, i) => (i < filterAll.length - 1 ? [e, 'OR'] : [e]))
                .reduce((a, b) => a.concat(b));
            this.tempArr.push(multiFilterField)
        } else {
            defaultFilterArr = [filterItem.field, filterItem.operator, filterItem.value];
            this.tempArr.push(defaultFilterArr);
        }
    }

    /**
     * Функция формирует массив из всех примененных фильтров для отправки в запросе
     */
    formFilterObject() {
        // @ts-ignore
        if (this.tempArr.length > 1 && this.userFilterInput?.length > 1) {
            this.filter = this.tempArr
                .map((e, i) => (i < this.tempArr.length - 1 ? [e, 'AND'] : [e]))
                .reduce((a, b) => a.concat(b));
            return this.filter;
        } else {
            this.filter = this.tempArr
            return this.filter;
        }
    }
}
