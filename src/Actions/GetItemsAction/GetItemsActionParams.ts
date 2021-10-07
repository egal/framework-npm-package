import { ActionParameters } from "../Interfaces/ActionParameters";
import { GetItemsSortingParams } from "./GetItemsSortingParams";
import { GetItemsFilterParams } from "./GetItemsFilterParams";

export class GetItemsActionParams implements ActionParameters {
  filter: (string | object)[];
  private order: (string | object | number)[] | undefined;
  private withs: string[];
  pagination: (number | undefined)[] | null;
  private id: number | string | undefined;

  constructor() {
    this.withs = [];
    this.filter = [];
    this.order = [];
    this.pagination = null;
    this.id = "";
  }

  /**
   * Функция формирует массив с выбранными пользователем with
   * @param withObj
   */
  with(withObj: string | string[] | undefined) {
    if (withObj) {
      // @ts-ignore
      Array.isArray(withObj)
        ? (this.withs = withObj)
        : this.withs.push(withObj);
    } else return undefined;
  }

  /**
   * Функция для передачи id в параметры, применяется при запросах getItem, update, delete
   * @param setId
   */
  setId(setId: number | string | undefined) {
    this.id = setId;
  }

  /**
   * Функция формирования фильтров
   * @param filterObj
   */
  filters(filterObj: (string | object)[] | undefined) {
    const newFilterObj = new GetItemsFilterParams(filterObj);
    newFilterObj.checkFilterType();
    this.filter = newFilterObj.formFilterObject();
  }

  /**
   * Функция формирования массива сортировок
   * @param orderObj
   */
  orders(orderObj: string[][] | undefined) {
    this.order = new GetItemsSortingParams().createOrderObj(orderObj);
  }

  setPagination(perPage: number | undefined, page: number | undefined) {
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
      id: this.id,
    };
  }
}
