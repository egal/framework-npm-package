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
const ModelConnection_1 = require("./ModelConnection");
const observer = Observer_1.EventObserver.getInstance();
class Model {
    constructor(username, password, modelName) {
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
        this.tokenUmt = false;
        this.tokenUst = "";
    }
    setAuthToken(token) {
        GlobalVariables_1.GlobalVariables.tokenUST = token;
    }
    /**
     * Получение метаданных модели
     * @param microserviceName
     * @param connectionType
     */
    actionGetMetadata(microserviceName, connectionType) {
        GlobalVariables_1.GlobalVariables.tokenUST = microserviceName;
        const initializeGetMetadataRequest = new GetModelMetadataAction_1.GetModelMetadataAction(microserviceName, "getMetadata", this.modelName);
        new ModelConnection_1.ModelConnection().createConnection(connectionType, initializeGetMetadataRequest);
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
     * @param actionName
     */
    actionGetItems(microserviceName, connectionType, perPage, page, filter, withs, orders, actionName) {
        let userGetItems = actionName !== undefined ? actionName : "getItems";
        GlobalVariables_1.GlobalVariables.tokenUST = microserviceName;
        const initializeGetItems = new GetItemsAction_1.GetItemsAction(microserviceName, this.modelName, userGetItems);
        initializeGetItems.actionParameters.with(withs);
        initializeGetItems.actionParameters.filters(filter);
        initializeGetItems.actionParameters.orders(orders);
        if (perPage !== undefined && page !== undefined) {
            initializeGetItems.actionParameters.setPagination(perPage, page);
        }
        new ModelConnection_1.ModelConnection().createConnection(connectionType, initializeGetItems);
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
        GlobalVariables_1.GlobalVariables.tokenUST = microserviceName;
        const initializeGetItem = new GetItemsAction_1.GetItemsAction(microserviceName, this.modelName, "getItem");
        initializeGetItem.actionParameters.with(withs);
        initializeGetItem.actionParameters.filters(filter);
        initializeGetItem.actionParameters.orders(orders);
        initializeGetItem.actionParameters.setId(id);
        new ModelConnection_1.ModelConnection().createConnection(connectionType, initializeGetItem);
    }
    /**
     * Экшен обновления записи
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */
    actionUpdate(microserviceName, connectionType, actionParams) {
        GlobalVariables_1.GlobalVariables.tokenUST = microserviceName;
        const initializeActionUpdate = new CRUDAction_1.CRUDAction(microserviceName, this.modelName, "update", actionParams);
        new ModelConnection_1.ModelConnection().createConnection(connectionType, initializeActionUpdate);
    }
    /**
     *
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */
    actionUpdateMany(microserviceName, connectionType, actionParams) {
        GlobalVariables_1.GlobalVariables.tokenUST = microserviceName;
        const initializeActionUpdate = new CRUDAction_1.CRUDAction(microserviceName, this.modelName, "updateMany", actionParams);
        new ModelConnection_1.ModelConnection().createConnection(connectionType, initializeActionUpdate);
    }
    /**
     * Экшен обновляет записи, соответствующие заданным фильтрам
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */
    actionUpdateManyWithFilter(microserviceName, connectionType, actionParams) {
        GlobalVariables_1.GlobalVariables.tokenUST = microserviceName;
        const initializeActionUpdateManyWithFilter = new CRUDAction_1.CRUDAction(microserviceName, this.modelName, "updateManyRaw", actionParams);
        new ModelConnection_1.ModelConnection().createConnection(connectionType, initializeActionUpdateManyWithFilter);
    }
    /**
     * Экшен создания записи
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     * @param channelParameters
     */
    actionCreate(microserviceName, connectionType, actionParams, channelParameters) {
        GlobalVariables_1.GlobalVariables.tokenUST = microserviceName;
        const initializeActionCreate = new CRUDAction_1.CRUDAction(microserviceName, this.modelName, "create", actionParams, channelParameters);
        new ModelConnection_1.ModelConnection().createConnection(connectionType, initializeActionCreate);
    }
    /**
     *
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */
    actionCreateMany(microserviceName, connectionType, actionParams) {
        GlobalVariables_1.GlobalVariables.tokenUST = microserviceName;
        const initializeActionCreate = new CRUDAction_1.CRUDAction(microserviceName, this.modelName, "createMany", actionParams);
        new ModelConnection_1.ModelConnection().createConnection(connectionType, initializeActionCreate);
    }
    /**
     * Экшен удаления записи
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */
    actionDelete(microserviceName, connectionType, actionParams) {
        GlobalVariables_1.GlobalVariables.tokenUST = microserviceName;
        const initializeActionDelete = new CRUDAction_1.CRUDAction(microserviceName, this.modelName, "delete", actionParams);
        new ModelConnection_1.ModelConnection().createConnection(connectionType, initializeActionDelete);
    }
    /**
     *
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */
    actionDeleteMany(microserviceName, connectionType, actionParams) {
        GlobalVariables_1.GlobalVariables.tokenUST = microserviceName;
        const initializeActionDelete = new CRUDAction_1.CRUDAction(microserviceName, this.modelName, "deleteMany", actionParams);
        new ModelConnection_1.ModelConnection().createConnection(connectionType, initializeActionDelete);
    }
    /**
     * Экшен удаляет записи, соответствующие заданным фильтрам
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */
    actionDeleteManyWithFilter(microserviceName, connectionType, actionParams) {
        GlobalVariables_1.GlobalVariables.tokenUST = microserviceName;
        const initializeActionDeleteManyWithFilter = new CRUDAction_1.CRUDAction(microserviceName, this.modelName, "deleteManyRaw", actionParams);
        new ModelConnection_1.ModelConnection().createConnection(connectionType, initializeActionDeleteManyWithFilter);
    }
    /**
     *
     * @param microserviceName
     * @param actionName
     * @param connectionType
     * @param actionParams
     */
    actionCustom(microserviceName, actionName, connectionType, actionParams) {
        GlobalVariables_1.GlobalVariables.tokenUST = microserviceName;
        const initializeActionCustom = new CustomAction_1.CustomAction(microserviceName, this.modelName, actionName, actionParams);
        new ModelConnection_1.ModelConnection().createConnection(connectionType, initializeActionCustom);
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
        if (filterType === "includes")
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
    setBaseUrl(URL) {
        GlobalVariables_1.GlobalVariables.httpBaseUrl = URL;
    }
    socketDisconnect() {
        observer.broadcastSocketDisconnect("disconnect");
    }
}
exports.Model = Model;
