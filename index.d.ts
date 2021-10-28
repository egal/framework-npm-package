import axios, {Method} from "axios";

declare class ActionError {
    constructor(message: string, code?: number | undefined);

    code: number | undefined;
    message: string;

    getMessage(): string;
}

declare class ActionResult {
    constructor(data: object, actionName?: string, modelName?: string, actionMessage?: object);

    data: object;
    actionName?: string;
    modelName?: string;
    actionMessage?: object;

    getData(): Array<string | undefined | object>;
}

declare class CRUDAction {
    constructor(
        microserviceName: string,
        modelName: string,
        actionName: string,
        actionParams?: any,
        channelParameters?: any
    );

    actionParameters: CRUDActionParams;
    microserviceName: string;
    modelName: string;
    actionName: string;
    channelParameters: RoutingKeyParams;
}

declare class CRUDActionParams {
    data: object;

    toObject(): object;
}

declare class CustomAction {
    constructor(microserviceName: string, modelName: string, actionName: string, actionParams?: any)

    actionParameters: any;
    microserviceName: string;
    modelName: string;
    actionName: string;
}

declare class GetItemsAction {
    constructor(microserviceName: string, modelName: string, actionName: string, actionParams?: any)

    actionParameters: GetItemsActionParams;
    microserviceName: string;
    modelName: string;
    actionName: string;
}

declare class GetItemsActionParams {
    constructor()

    filter: (string | object)[];
    order: (string | object | number)[] | undefined;
    withs: string[];
    pagination: (number | undefined)[] | null;
    id: number | string | undefined;

    with(withObj: string | string[] | undefined): string[] | undefined

    setId(setId: number | string | undefined): void

    filters(filterObj: (string | object)[] | undefined): void

    orders(orderObj: string[][] | undefined): void

    setPagination(perPage: number | undefined, page: number | undefined): void

    toObject(): ReturnObject
}

declare class GetItemsFilterParams {
    constructor(filterObj: (string | object)[] | undefined)

    filter: (string | object)[];
    tempArr: (string | object)[];
    userFilterInput: (string | object)[] | undefined;
    defaultFilterArr: any;
    multiFilterField: any;

    checkFilterType(): void

    createDefaultObjectInstance(filterItem: any): void

    formComplexLeftNestedFilter(filterItem: any): void

    formComplexRightNestedValue(filterItem: any): void

    formFilterObject(): (string | object)[]
}

declare class GetItemsSortingParams {
    constructor()

    order: ReturnSortingObject[];

    createOrderObj(receivedOrderArr: (string[] | string)[] | undefined): ReturnSortingObject[]
}

declare class GetAllMetaDataAction {
    constructor(microserviceName: string, actionName: string, modelName: string)

    microserviceName: string;
    actionName: string;
    modelName: string;
}

declare class GetModelMetadataAction {
    constructor(microserviceName: string, actionName: string, modelName: string)

    microserviceName: string;
    actionName: string;
    modelName: string;
}

declare class EventObserver {
    private constructor()
    private static instance: EventObserver | null;
    private modelName: string | undefined;
    subscribe(modelName: string, fn: any):any
    unsubscribe(modelName: string):any
    broadcast(
        data: string[] | object[] | string | object,
        actionName?: string,
        receivedModelName?: string,
        actionMessage?: string | object
    ):any
    broadcastSocketDisconnect(modelName: string):any
    checkObservers(): any
    static getInstance():any
}

declare class GenerateJSON {
    generateJSONObj(
        type: string,
        serviceName: string,
        modelName: string,
        actionName: string,
        actionParameters: ActionParameters | undefined,
        token: string | null,
        uuid: string
    ):any
    formFilter(filterObj: (string | object)[] | undefined): (string | object)[]
}

declare class HttpRequest {
    constructor()
    actionResult: ActionResult;
    actionError: ActionError;
    subscribeTokenRefresh(cb: any): void
    onRefreshed(token: any): void
    refreshAccessToken(serviceName: string): Promise<any>
    axiosConnect(
        serviceName: string,
        modelName: string,
        actionName: string,
        httpMethod: Method,
        actionParameters: ActionParameters | undefined,
        tokenName?: string
    ):Promise<any>
}

declare class ActionMessage {
    constructor(
        microserviceName: string,
        actionName: string,
        modelName: string,
        actionParameters?: ActionParameters,
        channelParameters?: any
    )
    serviceName: string;
    modelName: string;
    actionName: string;
    httpMethod: Method;
    httpRequest: HttpRequest;
    channelParameters: RoutingKeyParams;
    actionParameters?: ActionParameters;
    axiosConnect(constructorRequest?: boolean):Promise<any>
}

declare class AuthAction {
    constructor(modelName: string, requestType: string)
    private microserviceName: string;
    private modelName: string;
    private httpMethod: Method;
    private httpRequest: HttpRequest;
    private requestAction: string;
    private requestType: string;
    setBaseURL(baseAuthURL: string):void
    setTokenUST(tokenUST: string):void
    setTokenUMT(tokenUMT: string):void
    setNetworkRequest(
        userData: ActionParameters | undefined,
        requestType: string,
        tokenName?: string
    ):Promise<any>
    registerNewUser(newUserData: ActionParameters | undefined):Promise<any>
    authUser(createdUserData: ActionParameters | undefined):Promise<any>
    loginToService(userCred: ActionParameters | undefined, tokenName?: string):Promise<any>
}

declare class AuthParams {
    parameters: ActionParameters | undefined;
    constructor()
    setAuthParams(params: ActionParameters | undefined):any
    toObject():any
}

declare class ActionConstructor {
    constructor(url: string)
    filterArr: (string | object)[];
    ordersArr: Array<object>;
    withsArr: Array<string>;
    microserviceName: string;
    modelName: string;
    actionName: string;
    actionParams: Array<object> | object;
    pagination: { per_page: number | undefined; page: number | undefined };
    id: string | number;
    url: string;
    setBaseUrl(url: string):void
    clearParams():void
    getMetadata(microserviceName: string, modelName: string): this
    getItems(microserviceName: string, modelName: string): this
    getItem(microserviceName: string, modelName: string, id: string | number): this
    create(microserviceName: string, modelName: string, actionParams: object): this
    update(microserviceName: string, modelName: string, actionParams: object): this
    delete(microserviceName: string, modelName: string, actionParams: object): this
    createMany(microserviceName: string, modelName: string, actionParams: object): this
    updateMany(microserviceName: string, modelName: string, actionParams: object): this
    updateManyWithFilter(microserviceName: string, modelName: string, actionParams: object): this
    deleteManyWithFilter(microserviceName: string, modelName: string, actionParams: object): this
    custom(
        microserviceName: string,
        modelName: string,
        actionName: string,
        actionParams: object
    ): this
    getCount(microserviceName: string, modelName: string): this
    filter(filterObject: (string | object)[]): this
    withs(withs: Array<string>): this
    order(orders: string[][] | undefined): this
    setPagination(perPage: number, page: number): this
    call():Promise<any>
}

declare class EgalAuthConstructor {
    constructor(authParams: { modelName: string; url: string; connectionType: string })
    egalAuth: AuthAction;
    url: string;
    initAuthAction():any
    registerNewUser(newUserData: ActionParameters):Promise<any>
    authUser(createdUserData: ActionParameters):Promise<any>
    loginToService(userCred: ActionParameters, tokenName?: string):Promise<any>
}

declare class EgalConstructor {
    constructor(modelParams: {
        modelName: string;
        username: string;
        password: string;
        url: string;
        connectionType: string;
        tokenName: string;
    })
    egalModel: Model;
    egalObserver: EventObserver;
    modelName: string;
    username: string;
    password: string;
    url: string;
    connectionType: string;
    initModel():any
    initModelObserver():Promise<any>
}

declare class ValidationConstructor {
    constructor(data: object, rules: object, customMessages?: any)
    data: object;
    rules: object | undefined;
    validation: any;
    customMessages: any | undefined;
    validate():Promise<any>
    createValidationRule(ruleObject: {
        name: string;
        callback: (value: string | number | Boolean) => RegExpMatchArray | null;
        message: string;
    }):any
    overrideDefaultMessage(rule: string, message: string, lang?: string):any
    getAllErrorMessages(languageCode: string):any
    getAllAvailableRules():any
}

declare class DataFormatter {
    constructor(receivedData: string[], allItems: object[])
    receivedData: string[];
    formattedData: object[];
    allItems: object[];
}

declare class Model {
    constructor(username: string, password: string, modelName: string)
    modelName: string;
    username: string;
    password: string;
    modelMetaData: MetaDataInterface;
    modelItems: (string | object)[];
    modelActionList: string[];
    modelValidationRules: object;
    modelActionsMetaData: object;
    actionResponse: string | object;
    databaseFields: string[];
    fieldsWithTypes: object[];
    allModelsMetadata: string | object;
    tokenUst: string;
    tokenUmt: boolean;
    setAuthToken(token: string):any
    actionGetMetadata(microserviceName: string, connectionType: string):any
    actionGetItems(
        microserviceName: string,
        connectionType: string,
        perPage?: number,
        page?: number,
        filter?: (string | object)[] | undefined,
        withs?: string | string[],
        orders?: string[][],
        actionName?: string
    ):any
    actionGetItem(
        microserviceName: string,
        connectionType: string,
        id: string,
        filter?: (string | object)[] | undefined,
        withs?: [],
        orders?: string[][]
    ):any
    actionUpdate(microserviceName: string, connectionType: string, actionParams: object):any
    actionUpdateMany(microserviceName: string, connectionType: string, actionParams: object):any
    actionUpdateManyWithFilter(
        microserviceName: string,
        connectionType: string,
        actionParams: object
    ):any
    actionCreate(
        microserviceName: string,
        connectionType: string,
        actionParams: object,
        channelParameters?: RoutingKeyParams
    ):any
    actionCreateMany(microserviceName: string, connectionType: string, actionParams: object):void
    actionDelete(microserviceName: string, connectionType: string, actionParams: string[]):void
    actionDeleteMany(microserviceName: string, connectionType: string, actionParams: string[]):void
    actionDeleteManyWithFilter(
        microserviceName: string,
        connectionType: string,
        actionParams: object
    ):any
    actionCustom(
        microserviceName: string,
        actionName: string,
        connectionType: string,
        actionParams?: object
    ):any
    getModelMetadata():any
    getModelActionList():any
    getModelValidationRules():any
    getModelActionsMetaData():any
    getModelDataBaseFields():any
    getModelFieldsWithTypes():any
    getItems():any
    getAllModelsMetadata():any
    setBaseUrl(URL: string, connectionType: string):void
    socketDisconnect():any
}

declare class ModelConnection {
    createConnection(connectionType: string, userRequest: any):any
}
declare class GlobalVariables {
    public static socketBaseUrl: string;
    public static httpBaseUrl: string;
    public static authBaseUrl: string;
    public static tokenUST: string;
    public static tokenUMT: string;
}

interface ActionConstructorInterface {
    getMetadata(microserviceName: string, modelName: string): this;
    getItems(microserviceName: string, modelName: string): this;
    getItem(microserviceName: string, modelName: string, id: string | number): this;
    create(microserviceName: string, modelName: string, actionParams: object): this;
    update(microserviceName: string, modelName: string, actionParams: object): this;
    delete(microserviceName: string, modelName: string, actionParams: object): this;
    createMany(microserviceName: string, modelName: string, actionParams: object): this;
    updateMany(microserviceName: string, modelName: string, actionParams: object): this;
    updateManyWithFilter(microserviceName: string, modelName: string, actionParams: object): this;
    deleteManyWithFilter(microserviceName: string, modelName: string, actionParams: object): this;
    custom(
        microserviceName: string,
        modelName: string,
        actionName: string,
        actionParams: object
    ): this;
    getCount(microserviceName: string, modelName: string): this;
    filter(filterObject: object): this;
    withs(withs: Array<string>): this;
    order(orders: string[][] | undefined): this;
    setPagination(perPage: number, page: number): this;
}

interface ActionInterace {
    microserviceName: string;
    modelName: string;
    actionName: string;
    actionParams?: object;
}

interface ActionMessageInterface {
    serviceName: string;
    modelName: string;
    actionName: string;
    actionParameters?: ActionParameters;
    httpMethod: Method;
    httpRequest: HttpRequest;
    axiosConnect(): void;
}

interface ActionParameters {
    filter?: (string | object)[];
    attributes?: (string | number | object)[] | undefined;
    email?: string;
    password?: string;
    service_name?: string | undefined;
    model_name?: string | undefined;
    model_id?: number | undefined;
    event_name?: string | undefined;
    token?: string | object;
    toObject?(): object | null;
}

interface RoutingKeyParams {
    service_name?: string | undefined;
    model_name?: string | undefined;
    model_id?: number | undefined;
    event_name?: string | undefined;
}

interface ParametersInterface {
    filter?: (string | object)[];
    attributes?: (string | number | object)[] | object;
    objects?: (string | number | object)[] | object;
    ids?: (string | number | object)[] | object;
}

interface MetaDataInterface {
    model_class: string;
    model_short_name: string;
    database_fields: string[];
    fields_with_types: object[];
    fake_fields: object[];
    relations: string[];
    validation_rules: object;
    primary_keys: string[];
    actions_metadata: object;
    push(data: string | object): void;
}

interface ModelInterface {
    actionGetMetadata(microserviceName: string, actionName: string, connectionType: string): any;

    actionGetItem(
        microserviceName: string,
        connectionType: string,
        id: string,
        filter?: (string | object)[] | undefined,
        orders?: object[]
    ): any;

    actionGetItems(
        microserviceName: string,
        connectionType: string,
        perPage?: number,
        page?: number,
        filter?: (string | object)[] | undefined,
        withs?: string | string[] | undefined,
        orders?: object[],
        actionName?: string
    ): any;

    actionCreate(
        microserviceName: string,
        connectionType: string,
        actionParams?: any,
        channelParameters?: RoutingKeyParams | undefined
    ): any;

    actionUpdate(microserviceName: string, connectionType: string, actionParams?: any): any;

    actionDelete(microserviceName: string, connectionType: string, actionParams?: any): any;

    actionCreateMany(
        microserviceName: string,
        connectionType: string,
        actionParams?: any,
        channelParameters?: RoutingKeyParams | undefined
    ): any;

    actionUpdateMany(microserviceName: string, connectionType: string, actionParams?: any): any;

    actionDeleteMany(microserviceName: string, connectionType: string, actionParams?: any): any;

    actionCustom(
        microserviceName: string,
        actionName: string,
        connectionType: string,
        actionParams?: object
    ): any;

    getModelMetadata(): any;

    getModelActionList(): any;

    getModelValidationRules(): any;

    getModelActionsMetaData(): any;

    getModelDataBaseFields(): any;

    getModelFieldsWithTypes(): any;

    actionUpdateManyWithFilter(
        microserviceName: string,
        connectionType: string,
        actionParams: object
    ): any;

    actionDeleteManyWithFilter(
        microserviceName: string,
        connectionType: string,
        actionParams: object
    ): any;
    setBaseUrl(URL: string, connectionType: string): void;
}

declare let rules:object[];
declare let observers:any;
declare const decipherJWT:any;
declare const setCookie:any;
declare const getCookie:any;
declare const deleteAllCookies:any;
declare const deleteCookie:any;
declare let isRefreshing:boolean;
declare let refreshSubscribers: any[];
declare let register:string;
declare let auth:string;
declare let loginIntoService:string;
declare let setErrorLang:any;
declare type ReturnObject = {
    pagination: (number | undefined)[] | null;
    filter: (string | object)[];
    withs: string[];
    order: (string | object | number)[] | undefined;
    id: number | string | undefined;
};

declare type ReturnSortingObject = {
    column: string | undefined;
    direction: string | undefined;
};