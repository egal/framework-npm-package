import {ModelInterface} from './ModelInterface';
import {GetItemsAction} from '../Actions/GetItemsAction/GetItemsAction';
import {CRUDAction} from '../Actions/CRUDActions/CRUDAction';
import {CustomAction} from "../Actions/CustomAction/CustomAction";
import {GetModelMetadataAction} from '../Actions/GetMetadataAction/GetModelMetadataAction';
import {DataFormatter} from './DataFormatter';
import {MetaDataInterface} from './MetaDataInterface';
import {EventObserver} from '../Actions/NetworkRequests/SocketConnection/Observer';
import {GlobalVariables, setCookie, deleteAllCookies} from '../GlobalVariables';
import {RoutingKeyParams} from "../Actions/Interfaces/RoutingKeyParams";
import {Method} from "axios";

const observer = new EventObserver();

export class Model implements ModelInterface {
    private readonly modelName: string;
    private readonly username: string;
    private readonly password: string;
    private modelMetaData!: MetaDataInterface;
    private readonly modelItems: (string | object)[];
    private modelActionList: string[];
    private readonly modelValidationRules: object;
    private modelActionsMetaData: object;
    private actionResponse: string | object;
    private databaseFields: string[];
    private fieldsWithTypes: object[];
    private allModelsMetadata: string | object;
    private tokenUst: boolean;
    private tokenUmt: boolean;

    constructor(modelName: string, username: string, password: string) {
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
        observer.subscribe(this.modelName, (data: any, actionName?: string) => {
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
                        setCookie('umt', data[0])
                        break;
                    case 'loginToService':
                        setCookie('mandate', data[0])
                }
            }
            if (data === 'Session expired!') {
                deleteAllCookies()
            }
        });
    }

    private static setConnectionType(connectionType: string, callToAction: any) {
        if (connectionType === 'socket') {
            callToAction.socketConnect();
        } else {
            callToAction.axiosConnect();
        }
    }

    /**
     * Получение метаданных модели
     * @param microserviceName
     * @param connectionType
     */
    actionGetMetadata(microserviceName: string, connectionType: string) {
        const initializeGetMetadataRequest = new GetModelMetadataAction(
            this.username,
            this.password,
            microserviceName,
            'getMetadata',
            this.modelName
        );
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
    actionGetItems(
        microserviceName: string,
        connectionType: string,
        perPage?: number,
        page?: number,
        filter?: (string | object)[] | undefined,
        withs?: string | string[],
        orders?: string[][]
    ) {
        const initializeGetItems = new GetItemsAction(this.username, this.password, microserviceName, this.modelName, 'getItems');
        initializeGetItems.actionParameters.with(withs)
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
    actionGetItem(
        microserviceName: string,
        connectionType: string,
        id: string,
        filter?: (string | object)[] | undefined,
        withs?: [],
        orders?: string[][]
    ) {
        const initializeGetItem = new GetItemsAction(this.username, this.password, microserviceName, this.modelName, 'getItem');
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
    actionUpdate(
        microserviceName: string,
        connectionType: string,
        actionParams: object
    ) {
        const initializeActionUpdate = new CRUDAction(
            this.username,
            this.password,
            microserviceName,
            this.modelName,
            'update',
            actionParams
        );
        Model.setConnectionType(connectionType, initializeActionUpdate);
    }

    /**
     *
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */

    actionUpdateMany(
        microserviceName: string,
        connectionType: string,
        actionParams: object
    ) {
        const initializeActionUpdate = new CRUDAction(
            this.username,
            this.password,
            microserviceName,
            this.modelName,
            'updateMany',
            actionParams
        );
        Model.setConnectionType(connectionType, initializeActionUpdate);
    }

    /**
     * Экшен обновляет записи, соответствующие заданным фильтрам
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */
    actionUpdateManyWithFilter(
        microserviceName: string,
        connectionType: string,
        actionParams: object
    ) {
        const initializeActionUpdateManyWithFilter = new CRUDAction(
            this.username,
            this.password,
            microserviceName,
            this.modelName,
            'updateManyRaw',
            actionParams
        );
        Model.setConnectionType(connectionType, initializeActionUpdateManyWithFilter);
    }

    /**
     * Экшен создания записи
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     * @param channelParameters
     */
    actionCreate(
        microserviceName: string,
        connectionType: string,
        actionParams: object,
        channelParameters?: RoutingKeyParams
    ) {
        const initializeActionCreate = new CRUDAction(
            this.username,
            this.password,
            microserviceName,
            this.modelName,
            'create',
            actionParams,
            channelParameters
        );
        Model.setConnectionType(connectionType, initializeActionCreate);
    }

    /**
     *
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */

    actionCreateMany(
        microserviceName: string,
        connectionType: string,
        actionParams: object
    ) {
        const initializeActionCreate = new CRUDAction(
            this.username,
            this.password,
            microserviceName,
            this.modelName,
            'createMany',
            actionParams
        );
        Model.setConnectionType(connectionType, initializeActionCreate);
    }

    /**
     * Экшен удаления записи
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */
    actionDelete(
        microserviceName: string,
        connectionType: string,
        actionParams: string[]
    ) {
        const initializeActionDelete = new CRUDAction(
            this.username,
            this.password,
            microserviceName,
            this.modelName,
            'delete',
            actionParams
        );
        Model.setConnectionType(connectionType, initializeActionDelete);
    }

    /**
     *
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */

    actionDeleteMany(
        microserviceName: string,
        connectionType: string,
        actionParams: string[]
    ) {
        const initializeActionDelete = new CRUDAction(
            this.username,
            this.password,
            microserviceName,
            this.modelName,
            'deleteMany',
            actionParams
        );
        Model.setConnectionType(connectionType, initializeActionDelete);
    }

    /**
     * Экшен удаляет записи, соответствующие заданным фильтрам
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */
    actionDeleteManyWithFilter(
        microserviceName: string,
        connectionType: string,
        actionParams: object
    ) {
        const initializeActionDeleteManyWithFilter = new CRUDAction(
            this.username,
            this.password,
            microserviceName,
            this.modelName,
            'deleteManyRaw',
            actionParams
        );
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

    actionCustom(
        microserviceName: string,
        actionName: string,
        connectionType: string,
        requestType?: Method,
        actionParams?: object
    ) {
        const initializeActionCustom = new CustomAction(
            this.username,
            this.password,
            microserviceName,
            this.modelName,
            actionName,
            requestType,
            actionParams
        );
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

    getSpecificFields(fields: string[], filterType: string, dataToFilter: object[]) {
        if (filterType === 'includes') return new DataFormatter(fields, dataToFilter).include();
        return new DataFormatter(fields, dataToFilter).exclude();
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

    setBaseUrl(URL: string, connectionType: string) {
        if (connectionType === 'socket') GlobalVariables.socketBaseUrl = URL;
        GlobalVariables.httpBaseUrl = URL;
    }

    socketDisconnect() {
        observer.broadcastSocketDisconnect('disconnect')
    }

}
