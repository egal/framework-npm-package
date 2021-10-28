import { ModelInterface } from './ModelInterface';
import { GetItemsAction } from '../Actions/GetItemsAction/GetItemsAction';
import { CRUDAction } from '../Actions/CRUDActions/CRUDAction';
import { CustomAction } from '../Actions/CustomAction/CustomAction';
import { GetModelMetadataAction } from '../Actions/GetMetadataAction/GetModelMetadataAction';
import { MetaDataInterface } from './MetaDataInterface';
import { EventObserver } from '../Actions/NetworkRequests/SocketConnection/Observer';
import { GlobalVariables } from '../GlobalVariables';
import { RoutingKeyParams } from '../Actions/Interfaces/RoutingKeyParams';
import { ModelConnection } from './ModelConnection';

const observer: EventObserver = EventObserver.getInstance();

export class Model implements ModelInterface {
  modelName: string;
  username: string;
  password: string;
  modelMetaData!: MetaDataInterface;
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
  constructor(username: string, password: string, modelName: string) {
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
    this.tokenUst = '';
  }

  setAuthToken(token: string): any {
    GlobalVariables.tokenUST = token;
  }
  /**
   * Получение метаданных модели
   * @param microserviceName
   * @param connectionType
   */
  actionGetMetadata(microserviceName: string, connectionType: string): any {
    GlobalVariables.tokenUST = microserviceName;
    const initializeGetMetadataRequest = new GetModelMetadataAction(
      microserviceName,
      'getMetadata',
      this.modelName
    );
    new ModelConnection().createConnection(connectionType, initializeGetMetadataRequest);
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
  actionGetItems(
    microserviceName: string,
    connectionType: string,
    perPage?: number,
    page?: number,
    filter?: (string | object)[] | undefined,
    withs?: string | string[],
    orders?: string[][],
    actionName?: string
  ): any {
    let userGetItems = actionName !== undefined ? actionName : 'getItems';
    GlobalVariables.tokenUST = microserviceName;
    const initializeGetItems = new GetItemsAction(microserviceName, this.modelName, userGetItems);
    initializeGetItems.actionParameters.with(withs);
    initializeGetItems.actionParameters.filters(filter);
    initializeGetItems.actionParameters.orders(orders);
    if (perPage !== undefined && page !== undefined) {
      initializeGetItems.actionParameters.setPagination(perPage, page);
    }
    new ModelConnection().createConnection(connectionType, initializeGetItems);
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
  ): any {
    GlobalVariables.tokenUST = microserviceName;
    const initializeGetItem = new GetItemsAction(microserviceName, this.modelName, 'getItem');
    initializeGetItem.actionParameters.with(withs);
    initializeGetItem.actionParameters.filters(filter);
    initializeGetItem.actionParameters.orders(orders);
    initializeGetItem.actionParameters.setId(id);
    new ModelConnection().createConnection(connectionType, initializeGetItem);
  }

  /**
   * Экшен обновления записи
   * @param microserviceName
   * @param connectionType
   * @param actionParams
   */
  actionUpdate(microserviceName: string, connectionType: string, actionParams: object): any {
    GlobalVariables.tokenUST = microserviceName;
    const initializeActionUpdate = new CRUDAction(
      microserviceName,
      this.modelName,
      'update',
      actionParams
    );
    new ModelConnection().createConnection(connectionType, initializeActionUpdate);
  }

  /**
   *
   * @param microserviceName
   * @param connectionType
   * @param actionParams
   */

  actionUpdateMany(microserviceName: string, connectionType: string, actionParams: object): any {
    GlobalVariables.tokenUST = microserviceName;
    const initializeActionUpdate = new CRUDAction(
      microserviceName,
      this.modelName,
      'updateMany',
      actionParams
    );
    new ModelConnection().createConnection(connectionType, initializeActionUpdate);
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
  ): any {
    GlobalVariables.tokenUST = microserviceName;
    const initializeActionUpdateManyWithFilter = new CRUDAction(
      microserviceName,
      this.modelName,
      'updateManyRaw',
      actionParams
    );
    new ModelConnection().createConnection(connectionType, initializeActionUpdateManyWithFilter);
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
  ): any {
    GlobalVariables.tokenUST = microserviceName;
    const initializeActionCreate = new CRUDAction(
      microserviceName,
      this.modelName,
      'create',
      actionParams,
      channelParameters
    );
    new ModelConnection().createConnection(connectionType, initializeActionCreate);
  }

  /**
   *
   * @param microserviceName
   * @param connectionType
   * @param actionParams
   */

  actionCreateMany(microserviceName: string, connectionType: string, actionParams: object): any {
    GlobalVariables.tokenUST = microserviceName;
    const initializeActionCreate = new CRUDAction(
      microserviceName,
      this.modelName,
      'createMany',
      actionParams
    );
    new ModelConnection().createConnection(connectionType, initializeActionCreate);
  }

  /**
   * Экшен удаления записи
   * @param microserviceName
   * @param connectionType
   * @param actionParams
   */
  actionDelete(microserviceName: string, connectionType: string, actionParams: string[]): any {
    GlobalVariables.tokenUST = microserviceName;
    const initializeActionDelete = new CRUDAction(
      microserviceName,
      this.modelName,
      'delete',
      actionParams
    );
    new ModelConnection().createConnection(connectionType, initializeActionDelete);
  }

  /**
   *
   * @param microserviceName
   * @param connectionType
   * @param actionParams
   */

  actionDeleteMany(microserviceName: string, connectionType: string, actionParams: string[]): any {
    GlobalVariables.tokenUST = microserviceName;
    const initializeActionDelete = new CRUDAction(
      microserviceName,
      this.modelName,
      'deleteMany',
      actionParams
    );
    new ModelConnection().createConnection(connectionType, initializeActionDelete);
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
  ): any {
    GlobalVariables.tokenUST = microserviceName;
    const initializeActionDeleteManyWithFilter = new CRUDAction(
      microserviceName,
      this.modelName,
      'deleteManyRaw',
      actionParams
    );
    new ModelConnection().createConnection(connectionType, initializeActionDeleteManyWithFilter);
  }

  /**
   *
   * @param microserviceName
   * @param actionName
   * @param connectionType
   * @param actionParams
   */

  actionCustom(
    microserviceName: string,
    actionName: string,
    connectionType: string,
    actionParams?: object
  ): any {
    GlobalVariables.tokenUST = microserviceName;
    const initializeActionCustom = new CustomAction(
      microserviceName,
      this.modelName,
      actionName,
      actionParams
    );
    new ModelConnection().createConnection(connectionType, initializeActionCustom);
  }

  /**
   *   позволяет получить метадату текущей модели
   */
  getModelMetadata(): any {
    return this.modelMetaData;
  }

  /**
   * позволяет получить список доступных модели экшенов (получается с бэка в составе метадаты)
   */
  getModelActionList(): any {
    this.modelActionList = Object.keys(this.modelMetaData.actions_metadata);
    return this.modelActionList;
  }

  /**
   *  позволяет получить правила валидации для всех доступных филдов
   */
  getModelValidationRules(): any {
    return this.modelValidationRules;
  }

  /**
   *  позволяет получить расширинную информацию по каждому экшену
   */
  getModelActionsMetaData(): any {
    this.modelActionsMetaData = this.modelMetaData.actions_metadata;
    return this.modelActionsMetaData;
  }

  /**
   *  позволяет получить филды с типом base
   */
  getModelDataBaseFields(): any {
    this.databaseFields = this.modelMetaData.database_fields;
    return this.databaseFields;
  }

  /**
   *  позволяет получить филды с указанными типами
   */
  getModelFieldsWithTypes(): any {
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

  // getSpecificFields(fields: string[], filterType: string, dataToFilter: object[]) {
  // if (filterType === 'includes') return new DataFormatter(fields, dataToFilter).include();
  // return new DataFormatter(fields, dataToFilter).exclude();
  // }

  /**
   * позволяет получить уже запрошенные айтемы модели
   */
  getItems(): any {
    return this.modelItems;
  }

  /**
   * позволяет получить уже запрошенную метадату всех моделей приложения
   */
  getAllModelsMetadata(): any {
    return this.allModelsMetadata;
  }

  /**
   * Функция используется для установки основного домена при начале работы с моделью
   * @param URL
   * @param connectionType
   */

  setBaseUrl(URL: string, connectionType: string): void {
    if (connectionType === 'socket') GlobalVariables.socketBaseUrl = URL;
    GlobalVariables.httpBaseUrl = URL;
  }

  socketDisconnect(): any {
    observer.broadcastSocketDisconnect('disconnect');
  }
}
