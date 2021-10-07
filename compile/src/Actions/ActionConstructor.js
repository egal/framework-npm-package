"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionConstructor = void 0;
const GetItemsFilterParams_1 = require("./GetItemsAction/GetItemsFilterParams");
const GetItemsSortingParams_1 = require("./GetItemsAction/GetItemsSortingParams");
const GlobalVariables_1 = require("../GlobalVariables");
const CRUDAction_1 = require("./CRUDActions/CRUDAction");
const GetModelMetadataAction_1 = require("./GetMetadataAction/GetModelMetadataAction");
const CustomAction_1 = require("./CustomAction/CustomAction");
const GetItemsAction_1 = require("./GetItemsAction/GetItemsAction");
class ActionConstructor {
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
    getMetadata(microserviceName, modelName) {
        this.microserviceName = microserviceName;
        this.modelName = modelName;
        this.actionName = "getMetadata";
        return this;
    }
    getItems(microserviceName, modelName) {
        this.microserviceName = microserviceName;
        this.modelName = modelName;
        this.actionName = "getItems";
        return this;
    }
    getItem(microserviceName, modelName, id) {
        this.microserviceName = microserviceName;
        this.modelName = modelName;
        this.actionName = "getItem";
        this.id = id;
        return this;
    }
    create(microserviceName, modelName, actionParams) {
        this.microserviceName = microserviceName;
        this.modelName = modelName;
        this.actionParams = actionParams;
        this.actionName = "create";
        return this;
    }
    update(microserviceName, modelName, actionParams) {
        this.microserviceName = microserviceName;
        this.modelName = modelName;
        this.actionParams = actionParams;
        this.actionName = "update";
        return this;
    }
    delete(microserviceName, modelName, actionParams) {
        this.microserviceName = microserviceName;
        this.modelName = modelName;
        this.actionParams = actionParams;
        this.actionName = "delete";
        return this;
    }
    createMany(microserviceName, modelName, actionParams) {
        this.microserviceName = microserviceName;
        this.modelName = modelName;
        this.actionParams = actionParams;
        this.actionName = "createMany";
        return this;
    }
    updateMany(microserviceName, modelName, actionParams) {
        this.microserviceName = microserviceName;
        this.modelName = modelName;
        this.actionParams = actionParams;
        this.actionName = "updateMany";
        return this;
    }
    updateManyWithFilter(microserviceName, modelName, actionParams) {
        this.microserviceName = microserviceName;
        this.modelName = modelName;
        this.actionParams = actionParams;
        this.actionName = "updateManyRaw";
        return this;
    }
    deleteManyWithFilter(microserviceName, modelName, actionParams) {
        this.microserviceName = microserviceName;
        this.modelName = modelName;
        this.actionParams = actionParams;
        this.actionName = "deleteManyRaw";
        return this;
    }
    custom(microserviceName, modelName, actionName, actionParams) {
        this.microserviceName = microserviceName;
        this.modelName = modelName;
        this.actionParams = actionParams;
        this.actionName = actionName;
        return this;
    }
    getCount(microserviceName, modelName) {
        this.microserviceName = microserviceName;
        this.modelName = modelName;
        this.actionName = "getCount";
        return this;
    }
    filter(filterObject) {
        const newFilterObj = new GetItemsFilterParams_1.GetItemsFilterParams(filterObject);
        newFilterObj.checkFilterType();
        this.filterArr = newFilterObj.formFilterObject();
        return this;
    }
    withs(withs) {
        Array.isArray(withs) ? (this.withsArr = withs) : this.withsArr.push(withs);
        return this;
    }
    order(orders) {
        this.ordersArr = new GetItemsSortingParams_1.GetItemsSortingParams().createOrderObj(orders);
        return this;
    }
    setPagination(perPage, page) {
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
            GlobalVariables_1.GlobalVariables.tokenUST = this.microserviceName;
            switch (this.actionName) {
                case "getItems":
                case "getItem":
                case "getCount":
                    result = new GetItemsAction_1.GetItemsAction(this.microserviceName, this.modelName, this.actionName, actionParameters)
                        .axiosConnect(true)
                        .then((data) => {
                        resolve(data);
                    })
                        .catch((error) => {
                        reject(error);
                    });
                    break;
                case "getMetadata":
                    result = new GetModelMetadataAction_1.GetModelMetadataAction(this.microserviceName, this.actionName, this.modelName)
                        .axiosConnect(true)
                        .then((data) => {
                        resolve(data);
                    })
                        .catch((error) => {
                        reject(error);
                    });
                    break;
                case "custom":
                    result = new CustomAction_1.CustomAction(this.microserviceName, this.modelName, this.actionName, this.actionParams)
                        .axiosConnect(true)
                        .then((data) => {
                        resolve(data);
                    })
                        .catch((error) => {
                        reject(error);
                    });
                    break;
                default:
                    result = new CRUDAction_1.CRUDAction(this.microserviceName, this.modelName, this.actionName, this.actionParams)
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
exports.ActionConstructor = ActionConstructor;
