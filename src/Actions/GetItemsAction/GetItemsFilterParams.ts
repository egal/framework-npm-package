export class GetItemsFilterParams {
  filter: (string | object)[];
  tempArr: (string | object)[];
  userFilterInput: (string | object)[] | undefined;
  defaultFilterArr: any;
  multiFilterField: any;

  constructor(filterObj: (string | object)[] | undefined) {
    this.filter = [];
    this.tempArr = [];
    this.userFilterInput = filterObj;
  }

  /**
   * Функция разбирает массив с фильтрами, полученный от пользователя
   * и передает каждый айтем в след. функцию
   */
  checkFilterType(): void {
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
  createDefaultObjectInstance(filterItem: any): void {
    let filterAll: any[][] = [];
    let filterAllLeft: any[][] = [];
    let filterAllRight: any[][] = [];
    let temporalFilterArrLeft: any[][] = [];
    let temporalFilterArrRight: any[][] = [];
    let multiFilterFieldLeft: any;
    let multiFilterFieldRight: any;
    let leftComplexFilter: any[][] = [];
    let rightComplexFilter: any[][] = [];

    if (filterItem?.left && !filterItem.left?.left && !filterItem.right?.left) {
      if (Array.isArray(filterItem.left.value)) {
        filterItem.left.value.forEach((valueItem: any) => {
          temporalFilterArrLeft = [filterItem.left.field, filterItem.left.operator, valueItem];
          filterAllLeft.push(temporalFilterArrLeft);
        });
        multiFilterFieldLeft = filterAllLeft
          .map((e, i) => (i < filterAllLeft.length - 1 ? [e, 'OR'] : [e]))
          .reduce((a, b) => a.concat(b));
        leftComplexFilter.push(multiFilterFieldLeft);
      } else {
        leftComplexFilter = [
          filterItem.left.field,
          filterItem.left.operator,
          filterItem.left.value
        ];
      }
      if (Array.isArray(filterItem.right.value)) {
        filterItem.right.value.forEach((valueItem: any) => {
          temporalFilterArrRight = [filterItem.right.field, filterItem.right.operator, valueItem];
          filterAllRight.push(temporalFilterArrRight);
        });
        multiFilterFieldRight = filterAllRight
          .map((e, i) => (i < filterAllRight.length - 1 ? [e, 'OR'] : [e]))
          .reduce((a, b) => a.concat(b));
        rightComplexFilter.push(multiFilterFieldRight);
      } else {
        rightComplexFilter = [
          filterItem.right.field,
          filterItem.right.operator,
          filterItem.right.value
        ];
      }
      this.defaultFilterArr = [leftComplexFilter, filterItem.type, rightComplexFilter];
      if (this.userFilterInput?.length === 1) {
        this.tempArr = this.defaultFilterArr;
      } else {
        this.tempArr.push(this.defaultFilterArr);
      }
    } else if (filterItem.left?.left || filterItem.right?.left) {
      if (filterItem.left.left && !filterItem.right.left) {
        this.formComplexLeftNestedFilter(filterItem);
      }
      if (!filterItem.left.left && filterItem.right.left) {
        this.formComplexRightNestedValue(filterItem);
      }
      if (filterItem.left.left && filterItem.right.left) {
      }
    } else if (Array.isArray(filterItem.value)) {
      filterItem.value.forEach((valueItem: any) => {
        this.defaultFilterArr = [filterItem.field, filterItem.operator, valueItem];
        filterAll.push(this.defaultFilterArr);
      });
      this.multiFilterField = filterAll
        .map((e, i) => (i < filterAll.length - 1 ? [e, 'OR'] : [e]))
        .reduce((a, b) => a.concat(b));
      this.tempArr.push(this.multiFilterField);
    } else if (Array.isArray(filterItem)) {
      this.tempArr.push(filterItem);
    } else {
      this.defaultFilterArr = [filterItem.field, filterItem.operator, filterItem.value];
      this.tempArr.push(this.defaultFilterArr);
    }
  }

  formComplexLeftNestedFilter(filterItem: any): void {
    let filterAllLeft: any[][] = [];
    let filterAllRight: any[][] = [];
    let filterAllRightPart: any[][] = [];
    let leftComplexFilter: any[][] = [];
    let rightComplexFilter: any[][] = [];
    let rightFilterPart: any[][] = [];
    let temporalLeftFilterArr: any[][] = [];
    let temporalRightFilterArr: any[][] = [];
    let temporalFilterArr: any[][] = [];
    let multiFilterLeftField: any;
    let multiFilterRightField: any;
    let multiFilterNestedRightField: any;
    let defaultNestedFilterArr: any[][] = [];
    if (Array.isArray(filterItem.left.left.value)) {
      filterItem.left.left.value.forEach((valueItem: any) => {
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
    } else {
      leftComplexFilter = [
        filterItem.left.left.field,
        filterItem.left.left.operator,
        filterItem.left.left.value
      ];
    }
    if (Array.isArray(filterItem.left.right.value)) {
      filterItem.left.right.value.forEach((valueItem: any) => {
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
    } else {
      rightComplexFilter = [
        filterItem.left.right.field,
        filterItem.left.right.operator,
        filterItem.left.right.value
      ];
    }
    if (Array.isArray(filterItem.right.value)) {
      filterItem.right.value.forEach((valueItem: any) => {
        temporalFilterArr = [filterItem.right.field, filterItem.right.operator, valueItem];
        filterAllRightPart.push(temporalFilterArr);
      });
      multiFilterRightField = filterAllRightPart
        .map((e, i) => (i < filterAllRightPart.length - 1 ? [e, 'OR'] : [e]))
        .reduce((a, b) => a.concat(b));
      rightFilterPart.push(multiFilterRightField);
    } else {
      rightFilterPart = [filterItem.right.field, filterItem.right.operator, filterItem.right.value];
    }
    defaultNestedFilterArr = [leftComplexFilter, filterItem.left.type, rightComplexFilter];
    this.defaultFilterArr = [defaultNestedFilterArr, filterItem.type, rightFilterPart];
    if (this.userFilterInput?.length === 1) {
      this.tempArr = this.defaultFilterArr;
    } else {
      this.tempArr.push([this.defaultFilterArr]);
    }
  }

  formComplexRightNestedValue(filterItem: any): void {
    let filterAllLeft: any[][] = [];
    let filterAllRight: any[][] = [];
    let filterAllLeftPart: any[][] = [];
    let leftComplexFilter: any[][] = [];
    let rightComplexFilter: any[][] = [];
    let leftFilterPart: any[][] = [];
    let temporalLeftFilterArr: any[][] = [];
    let temporalRightFilterArr: any[][] = [];
    let temporalFilterArr: any[][] = [];
    let multiFilterLeftField: any;
    let multiFilterRightField: any;
    let multiFilterNestedLeftField: any[];
    let defaultNestedFilterArr: any[][] = [];
    if (Array.isArray(filterItem.right.left.value)) {
      filterItem.right.left.value.forEach((valueItem: any) => {
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
    } else {
      leftComplexFilter = [
        filterItem.right.left.field,
        filterItem.right.left.operator,
        filterItem.right.left.value
      ];
    }
    if (Array.isArray(filterItem.right.right.value)) {
      filterItem.right.right.value.forEach((valueItem: any) => {
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
    } else {
      rightComplexFilter = [
        filterItem.right.right.field,
        filterItem.right.right.operator,
        filterItem.right.right.value
      ];
    }
    if (Array.isArray(filterItem.left.value)) {
      filterItem.left.value.forEach((valueItem: any) => {
        temporalFilterArr = [filterItem.left.field, filterItem.left.operator, valueItem];
        filterAllLeftPart.push(temporalFilterArr);
      });
      multiFilterNestedLeftField = filterAllLeftPart
        .map((e, i) => (i < filterAllLeftPart.length - 1 ? [e, 'OR'] : [e]))
        .reduce((a, b) => a.concat(b));
      leftFilterPart.push(multiFilterNestedLeftField);
    } else {
      leftFilterPart = [filterItem.left.field, filterItem.left.operator, filterItem.left.value];
    }
    defaultNestedFilterArr = [leftComplexFilter, filterItem.right.type, rightComplexFilter];
    this.defaultFilterArr = [leftFilterPart, filterItem.type, defaultNestedFilterArr];
    if (this.userFilterInput?.length === 1) {
      this.tempArr = this.defaultFilterArr;
    } else {
      this.tempArr.push([this.defaultFilterArr]);
    }
  }

  /**
   * Функция формирует массив из всех примененных фильтров для отправки в запросе
   */
  formFilterObject(): (string | object)[] {
    // @ts-ignore
    if (this.tempArr.length > 1 && this.userFilterInput?.length > 1) {
      this.filter = this.tempArr
        .map((e, i) => (i < this.tempArr.length - 1 ? [e, 'AND'] : [e]))
        .reduce((a, b) => a.concat(b));
      return this.filter;
    } else {
      this.filter = this.tempArr;
      return this.filter;
    }
  }
}
