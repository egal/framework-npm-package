import { ActionParameters } from '../Interfaces/ActionParameters';
import { GetItemsSortingParams } from './GetItemsSortingParams';
import { GetItemsFilterParams } from './GetItemsFilterParams';

type ReturnObject = {
  pagination: (number | undefined)[] | null;
  filter: (string | object)[];
  withs: string[];
  order: (string | object | number)[] | undefined;
  id: number | string | undefined;
};

export class GetItemsActionParams implements ActionParameters {
  filter: (string | object)[];
  order: (string | object | number)[] | undefined;
  withs: string[];
  pagination: (number | undefined)[] | null;
  id: number | string | undefined;

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
  with(withObj: string | string[] | undefined): string[] | undefined {
    if (withObj) {
      Array.isArray(withObj) ? (this.withs = withObj) : this.withs.push(withObj);
    } else return undefined;
  }

  /**
   * Функция для передачи id в параметры, применяется при запросах getItem, update, delete
   * @param setId
   */
  setId(setId: number | string | undefined): void {
    this.id = setId;
  }

  /**
   * Функция формирования фильтров
   * @param filterObj
   */
  filters(filterObj: (string | object)[] | undefined): void {
    const newFilterObj = new GetItemsFilterParams(filterObj);
    newFilterObj.checkFilterType();
    this.filter = newFilterObj.formFilterObject();
  }

  /**
   * Функция формирования массива сортировок
   * @param orderObj
   */
  orders(orderObj: string[][] | undefined): void {
    this.order = new GetItemsSortingParams().createOrderObj(orderObj);
  }

  setPagination(perPage: number | undefined, page: number | undefined): void {
    // @ts-ignore
    this.pagination = { per_page: perPage, page: page };
  }

  /**
   * Функция, формирующая конечный объект параметров запроса
   */
  toObject(): ReturnObject {
    return {
      pagination: this.pagination,
      filter: this.filter,
      withs: this.withs,
      order: this.order,
      id: this.id
    };
  }
}
