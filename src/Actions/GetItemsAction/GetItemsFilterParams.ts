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
    let leftArrPart;
    let rightArrPart;
    let filterAll: any[][] = [];
    let multiFilterField;
    if (filterItem?.left) {
      leftArrPart = [filterItem.left.field, filterItem.left.operator, filterItem.left.value];
      rightArrPart = [filterItem.right.field, filterItem.right.operator, filterItem.right.value];
      defaultFilterArr = [leftArrPart, filterItem.type, rightArrPart];
      this.tempArr.push(defaultFilterArr);
    } else if (Array.isArray(filterItem.value)){
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
    if (this.tempArr.length >= 1) {
      this.filter = this.tempArr
        .map((e, i) => (i < this.tempArr.length - 1 ? [e, 'AND'] : [e]))
        .reduce((a, b) => a.concat(b));
      return this.filter;
    } else {
      return this.filter;
    }
  }
}
