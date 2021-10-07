"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateJSON = void 0;
const GetItemsFilterParams_1 = require("../GetItemsAction/GetItemsFilterParams");
class GenerateJSON {
    /**
     * Вспомогательная функция, формирующая JSON с параметрами запроса для использования с rabbitmq
     * т.к. параметры для разных экшенов надо обрабатывать по-разному, получается много условий
     * @param type тип запроса
     * @param serviceName имя микросервиса
     * @param modelName имя модели
     * @param actionName имя экшена
     * @param actionParameters все переданные параметры
     * @param token
     * @param uuid
     */
    generateJSONObj(type, serviceName, modelName, actionName, actionParameters, token, uuid) {
        const parametersCRUD = { attributes: {} };
        const parametersMany = { objects: {} };
        const parametersDeleteMany = { ids: [] };
        const parametersUpdateManyRaw = {
            filter: [],
            attributes: [],
        };
        const parametersDeleteManyRaw = { filter: [] };
        switch (actionName) {
            case "create":
            case "update":
            case "delete":
                parametersCRUD.attributes = actionParameters;
                return {
                    type: type,
                    service_name: serviceName,
                    model_name: modelName,
                    action_name: actionName,
                    parameters: parametersCRUD,
                    token: token,
                    uuid: uuid,
                };
            case "createMany":
            case "updateMany":
                parametersMany.objects = actionParameters;
                return {
                    type: type,
                    service_name: serviceName,
                    model_name: modelName,
                    action_name: actionName,
                    parameters: parametersMany,
                    token: token,
                    uuid: uuid,
                };
            case "deleteMany":
                parametersDeleteMany.ids = actionParameters;
                return {
                    type: type,
                    service_name: serviceName,
                    model_name: modelName,
                    action_name: actionName,
                    parameters: parametersDeleteMany,
                    token: token,
                    uuid: uuid,
                };
            case "updateManyRaw":
                parametersUpdateManyRaw.filter = this.formFilter(actionParameters === null || actionParameters === void 0 ? void 0 : actionParameters.filter);
                parametersUpdateManyRaw.attributes = actionParameters === null || actionParameters === void 0 ? void 0 : actionParameters.attributes;
                return {
                    type: type,
                    service_name: serviceName,
                    model_name: modelName,
                    action_name: actionName,
                    parameters: parametersUpdateManyRaw,
                    token: token,
                    uuid: uuid,
                };
            case "deleteManyRaw":
                parametersDeleteManyRaw.filter = this.formFilter(actionParameters === null || actionParameters === void 0 ? void 0 : actionParameters.filter);
                return {
                    type: type,
                    service_name: serviceName,
                    model_name: modelName,
                    action_name: actionName,
                    parameters: parametersDeleteManyRaw,
                    token: token,
                    uuid: uuid,
                };
            default:
                return {
                    type: type,
                    service_name: serviceName,
                    model_name: modelName,
                    action_name: actionName,
                    parameters: actionParameters,
                    token: token,
                    uuid: uuid,
                };
        }
    }
    formFilter(filterObj) {
        const newFilterObj = new GetItemsFilterParams_1.GetItemsFilterParams(filterObj);
        newFilterObj.checkFilterType();
        return newFilterObj.formFilterObject();
    }
}
exports.GenerateJSON = GenerateJSON;
