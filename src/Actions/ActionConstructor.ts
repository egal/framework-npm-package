import { ActionConstructorInterface } from "./Interfaces/ActionConstructorInterface";
import { GetItemsFilterParams } from "./GetItemsAction/GetItemsFilterParams";
import { GetItemsSortingParams } from "./GetItemsAction/GetItemsSortingParams";
import { GlobalVariables } from "../GlobalVariables";
import { CRUDAction } from "./CRUDActions/CRUDAction";
import { GetModelMetadataAction } from "./GetMetadataAction/GetModelMetadataAction";
import { CustomAction } from "./CustomAction/CustomAction";
import { GetItemsAction } from "./GetItemsAction/GetItemsAction";

export class ActionConstructor implements ActionConstructorInterface {
  filterArr: (string | object)[];
  ordersArr: Array<object>;
  withsArr: Array<string>;
  microserviceName: string;
  modelName: string;
  actionName: string;
  actionParams: Array<object> | object;
  pagination: { per_page: number; page: number };
  id: string | number;
  constructor() {
    this.filterArr = [];
    this.ordersArr = [];
    this.withsArr = [];
    this.microserviceName = "";
    this.modelName = "";
    this.actionName = "";
    this.actionParams = [];
    this.pagination = { per_page: 10, page: 1 };
    this.id = "";
  }
  getMetadata(microserviceName: string, modelName: string): this {
    this.microserviceName = microserviceName;
    this.modelName = modelName;
    this.actionName = "getMetadata";
    return this;
  }
  getItems(microserviceName: string, modelName: string): this {
    this.microserviceName = microserviceName;
    this.modelName = modelName;
    this.actionName = "getItems";
    return this;
  }
  getItem(
    microserviceName: string,
    modelName: string,
    id: string | number
  ): this {
    this.microserviceName = microserviceName;
    this.modelName = modelName;
    this.actionName = "getItem";
    this.id = id;
    return this;
  }
  create(
    microserviceName: string,
    modelName: string,
    actionParams: object
  ): this {
    this.microserviceName = microserviceName;
    this.modelName = modelName;
    this.actionParams = actionParams;
    this.actionName = "create";
    return this;
  }
  update(
    microserviceName: string,
    modelName: string,
    actionParams: object
  ): this {
    this.microserviceName = microserviceName;
    this.modelName = modelName;
    this.actionParams = actionParams;
    this.actionName = "update";
    return this;
  }
  delete(
    microserviceName: string,
    modelName: string,
    actionParams: object
  ): this {
    this.microserviceName = microserviceName;
    this.modelName = modelName;
    this.actionParams = actionParams;
    this.actionName = "delete";
    return this;
  }
  createMany(
    microserviceName: string,
    modelName: string,
    actionParams: object
  ): this {
    this.microserviceName = microserviceName;
    this.modelName = modelName;
    this.actionParams = actionParams;
    this.actionName = "createMany";
    return this;
  }
  updateMany(
    microserviceName: string,
    modelName: string,
    actionParams: object
  ): this {
    this.microserviceName = microserviceName;
    this.modelName = modelName;
    this.actionParams = actionParams;
    this.actionName = "updateMany";
    return this;
  }
  updateManyWithFilter(
    microserviceName: string,
    modelName: string,
    actionParams: object
  ): this {
    this.microserviceName = microserviceName;
    this.modelName = modelName;
    this.actionParams = actionParams;
    this.actionName = "updateManyRaw";
    return this;
  }
  deleteManyWithFilter(
    microserviceName: string,
    modelName: string,
    actionParams: object
  ): this {
    this.microserviceName = microserviceName;
    this.modelName = modelName;
    this.actionParams = actionParams;
    this.actionName = "deleteManyRaw";
    return this;
  }
  custom(
    microserviceName: string,
    modelName: string,
    actionName: string,
    actionParams: object
  ): this {
    this.microserviceName = microserviceName;
    this.modelName = modelName;
    this.actionParams = actionParams;
    this.actionName = actionName;
    return this;
  }
  getCount(microserviceName: string, modelName: string): this {
    this.microserviceName = microserviceName;
    this.modelName = modelName;
    this.actionName = "getCount";
    return this;
  }
  filter(filterObject: (string | object)[]): this {
    const newFilterObj = new GetItemsFilterParams(filterObject);
    newFilterObj.checkFilterType();
    this.filterArr = newFilterObj.formFilterObject();
    return this;
  }
  withs(withs: Array<string>): this {
    Array.isArray(withs) ? (this.withsArr = withs) : this.withsArr.push(withs);
    return this;
  }
  order(orders: string[][] | undefined): this {
    this.ordersArr = new GetItemsSortingParams().createOrderObj(orders);
    return this;
  }
  setPagination(perPage: number, page: number): this {
    this.pagination = { per_page: perPage, page: page };
    return this;
  }
  call() {
    return new Promise((resolve, reject) => {
      let result;
      let actionParameters = {
        pagination: this.pagination,
        filter: this.filterArr,
        withs: this.withsArr,
        order: this.ordersArr,
        id: this.id,
      };
      GlobalVariables.tokenUST = this.microserviceName;
      switch (this.actionName) {
        case "getItems":
        case "getItem":
        case "getCount":
          result = new GetItemsAction(
            this.microserviceName,
            this.modelName,
            this.actionName,
            actionParameters
          )
            .axiosConnect(true)
            .then((data) => {
              resolve(data);
            })
            .catch((error) => {
              reject(error);
            });
          break;
        case "getMetadata":
          result = new GetModelMetadataAction(
            this.microserviceName,
            this.actionName,
            this.modelName
          )
            .axiosConnect(true)
            .then((data) => {
              resolve(data);
            })
            .catch((error) => {
              reject(error);
            });
          break;
        case "custom":
          result = new CustomAction(
            this.microserviceName,
            this.modelName,
            this.actionName,
            this.actionParams
          )
            .axiosConnect(true)
            .then((data) => {
              resolve(data);
            })
            .catch((error) => {
              reject(error);
            });
          break;
        default:
          result = new CRUDAction(
            this.microserviceName,
            this.modelName,
            this.actionName,
            this.actionParams
          )
            .axiosConnect(true)
            .then((data) => {
              resolve(data);
            })
            .catch((error) => {
              reject(error);
            });
      }
    });
  }
}
