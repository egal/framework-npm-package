"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
const GetItemsAction_1 = require("../Actions/GetItemsAction/GetItemsAction");
const CRUDAction_1 = require("../Actions/CRUDActions/CRUDAction");
const CustomAction_1 = require("../Actions/CustomAction/CustomAction");
const GetModelMetadataAction_1 = require("../Actions/GetMetadataAction/GetModelMetadataAction");
const DataFormatter_1 = require("./DataFormatter");
const Observer_1 = require("../Actions/NetworkRequests/SocketConnection/Observer");
const GlobalVariables_1 = require("../GlobalVariables");
const observer = new Observer_1.EventObserver();
class Model {
    constructor(modelName, username, password) {
        this.modelName = modelName;
        this.username = username;
        this.password = password;
        this.modelItems = [];
        this.modelActionList = [];
        this.modelValidationRules = {};
        this.modelActionsMetaData = {};
        this.actionResponse = [];
        this.databaseFields = [];
        this.fieldsWithTypes = [];
        this.allModelsMetadata = {};
        this.tokenUst = false;
        this.tokenUmt = false;
        this.setObserver();
    }
    /**
     * инициализация обзервера, в зависимости от экшена инициализируется нужное событие
     */
    setObserver() {
        observer.subscribe(this.modelName, (data, actionName) => {
            if (data !== 'Start Processing' && data !== 'Session expired!') {
                switch (actionName) {
                    case 'getItems':
                        this.modelItems.push(data);
                        break;
                    case 'getAllModelsMetadata':
                        this.allModelsMetadata = data;
                        break;
                    case 'getMetadata':
                        this.modelMetaData.push(data);
                        break;
                    // case 'create':
                    // case 'update':
                    // case 'delete':
                    // case 'createMany':
                    // case 'updateMany':
                    // case 'deleteMany':
                    // case 'updateManyRaw':
                    // case 'deleteManyRaw':
                    //     this.actionGetItems(this.modelName, 'socket', actionName);
                    //     break;
                    case 'loginByEmailAndPassword':
                        GlobalVariables_1.setCookie('umt', data[0]);
                        break;
                    case 'loginToService':
                        GlobalVariables_1.setCookie('mandate', data[0]);
                }
            }
            if (data === 'Session expired!') {
                GlobalVariables_1.deleteAllCookies();
            }
        });
    }
    static setConnectionType(connectionType, callToAction) {
        if (connectionType === 'socket') {
            callToAction.socketConnect();
        }
        else {
            callToAction.axiosConnect();
        }
    }
    /**
     * Получение метаданных модели
     * @param microserviceName
     * @param connectionType
     */
    actionGetMetadata(microserviceName, connectionType) {
        const initializeGetMetadataRequest = new GetModelMetadataAction_1.GetModelMetadataAction(this.username, this.password, microserviceName, 'getMetadata', this.modelName);
        Model.setConnectionType(connectionType, initializeGetMetadataRequest);
    }
    /**
     * Получение данных модели с возможными параметрами, юзер передает все данные вместе, но в экшен их нужно передавать отдельно
     * @param microserviceName
     * @param connectionType
     * @param withs
     * @param filter
     * @param orders
     * @param page
     * @param perPage
     */
    actionGetItems(microserviceName, connectionType, perPage, page, filter, withs, orders) {
        const initializeGetItems = new GetItemsAction_1.GetItemsAction(this.username, this.password, microserviceName, this.modelName, 'getItems');
        initializeGetItems.actionParameters.with(withs);
        initializeGetItems.actionParameters.filters(filter);
        initializeGetItems.actionParameters.orders(orders);
        if (perPage !== undefined && page !== undefined) {
            initializeGetItems.actionParameters.setPagination(perPage, page);
        }
        Model.setConnectionType(connectionType, initializeGetItems);
    }
    /**
     * Отличается от getItems тем, что отдельно должен быть передан айди нужной записи
     * @param microserviceName
     * @param connectionType
     * @param id
     * @param withs
     * @param filter
     * @param orders
     */
    actionGetItem(microserviceName, connectionType, id, filter, withs, orders) {
        const initializeGetItem = new GetItemsAction_1.GetItemsAction(this.username, this.password, microserviceName, this.modelName, 'getItem');
        initializeGetItem.actionParameters.with(withs);
        initializeGetItem.actionParameters.filters(filter);
        initializeGetItem.actionParameters.orders(orders);
        initializeGetItem.actionParameters.setId(id);
        Model.setConnectionType(connectionType, initializeGetItem);
    }
    /**
     * Экшен обновления записи
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */
    actionUpdate(microserviceName, connectionType, actionParams) {
        const initializeActionUpdate = new CRUDAction_1.CRUDAction(this.username, this.password, microserviceName, this.modelName, 'update', actionParams);
        Model.setConnectionType(connectionType, initializeActionUpdate);
    }
    /**
     *
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */
    actionUpdateMany(microserviceName, connectionType, actionParams) {
        const initializeActionUpdate = new CRUDAction_1.CRUDAction(this.username, this.password, microserviceName, this.modelName, 'updateMany', actionParams);
        Model.setConnectionType(connectionType, initializeActionUpdate);
    }
    /**
     * Экшен обновляет записи, соответствующие заданным фильтрам
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */
    actionUpdateManyWithFilter(microserviceName, connectionType, actionParams) {
        const initializeActionUpdateManyWithFilter = new CRUDAction_1.CRUDAction(this.username, this.password, microserviceName, this.modelName, 'updateManyRaw', actionParams);
        Model.setConnectionType(connectionType, initializeActionUpdateManyWithFilter);
    }
    /**
     * Экшен создания записи
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     * @param channelParameters
     */
    actionCreate(microserviceName, connectionType, actionParams, channelParameters) {
        const initializeActionCreate = new CRUDAction_1.CRUDAction(this.username, this.password, microserviceName, this.modelName, 'create', actionParams, channelParameters);
        Model.setConnectionType(connectionType, initializeActionCreate);
    }
    /**
     *
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */
    actionCreateMany(microserviceName, connectionType, actionParams) {
        const initializeActionCreate = new CRUDAction_1.CRUDAction(this.username, this.password, microserviceName, this.modelName, 'createMany', actionParams);
        Model.setConnectionType(connectionType, initializeActionCreate);
    }
    /**
     * Экшен удаления записи
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */
    actionDelete(microserviceName, connectionType, actionParams) {
        const initializeActionDelete = new CRUDAction_1.CRUDAction(this.username, this.password, microserviceName, this.modelName, 'delete', actionParams);
        Model.setConnectionType(connectionType, initializeActionDelete);
    }
    /**
     *
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */
    actionDeleteMany(microserviceName, connectionType, actionParams) {
        const initializeActionDelete = new CRUDAction_1.CRUDAction(this.username, this.password, microserviceName, this.modelName, 'deleteMany', actionParams);
        Model.setConnectionType(connectionType, initializeActionDelete);
    }
    /**
     * Экшен удаляет записи, соответствующие заданным фильтрам
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */
    actionDeleteManyWithFilter(microserviceName, connectionType, actionParams) {
        const initializeActionDeleteManyWithFilter = new CRUDAction_1.CRUDAction(this.username, this.password, microserviceName, this.modelName, 'deleteManyRaw', actionParams);
        Model.setConnectionType(connectionType, initializeActionDeleteManyWithFilter);
    }
    /**
     *
     * @param microserviceName
     * @param actionName
     * @param connectionType
     * @param requestType
     * @param actionParams
     */
    actionCustom(microserviceName, actionName, connectionType, requestType, actionParams) {
        const initializeActionCustom = new CustomAction_1.CustomAction(this.username, this.password, microserviceName, this.modelName, actionName, requestType, actionParams);
        Model.setConnectionType(connectionType, initializeActionCustom);
    }
    /**
     *   позволяет получить метадату текущей модели
     */
    getModelMetadata() {
        return this.modelMetaData;
    }
    /**
     * позволяет получить список доступных модели экшенов (получается с бэка в составе метадаты)
     */
    getModelActionList() {
        this.modelActionList = Object.keys(this.modelMetaData.actions_metadata);
        return this.modelActionList;
    }
    /**
     *  позволяет получить правила валидации для всех доступных филдов
     */
    getModelValidationRules() {
        return this.modelValidationRules;
    }
    /**
     *  позволяет получить расширинную информацию по каждому экшену
     */
    getModelActionsMetaData() {
        this.modelActionsMetaData = this.modelMetaData.actions_metadata;
        return this.modelActionsMetaData;
    }
    /**
     *  позволяет получить филды с типом base
     */
    getModelDataBaseFields() {
        this.databaseFields = this.modelMetaData.database_fields;
        return this.databaseFields;
    }
    /**
     *  позволяет получить филды с указанными типами
     */
    getModelFieldsWithTypes() {
        this.fieldsWithTypes = this.modelMetaData.fields_with_types;
        return this.fieldsWithTypes;
    }
    /**
     * позволяет получить отфильтрованные список айтемов.
     * в функцию передается массив с названиями филдов от пользователя (fields), массив всех айтемов,
     * которые нужно отфильтровать (dataToFilter) и указание типа фильтрации (filterType): includes возвращаяет только филды,
     * указанные в массиве, excludes исключает филды, указанные в массиве
     *
     * @param fields
     * @param filterType
     * @param dataToFilter
     */
    getSpecificFields(fields, filterType, dataToFilter) {
        if (filterType === 'includes')
            return new DataFormatter_1.DataFormatter(fields, dataToFilter).include();
        return new DataFormatter_1.DataFormatter(fields, dataToFilter).exclude();
    }
    /**
     * позволяет получить уже запрошенные айтемы модели
     */
    getItems() {
        return this.modelItems;
    }
    /**
     * позволяет получить уже запрошенную метадату всех моделей приложения
     */
    getAllModelsMetadata() {
        return this.allModelsMetadata;
    }
    /**
     * Функция используется для установки основного домена при начале работы с моделью
     * @param URL
     * @param connectionType
     */
    setBaseUrl(URL, connectionType) {
        if (connectionType === 'socket')
            GlobalVariables_1.GlobalVariables.socketBaseUrl = URL;
        GlobalVariables_1.GlobalVariables.httpBaseUrl = URL;
    }
    socketDisconnect() {
        observer.broadcastSocketDisconnect('disconnect');
    }
}
exports.Model = Model;
