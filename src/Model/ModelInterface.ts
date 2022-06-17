import { RoutingKeyParams } from '../Actions/Interfaces/RoutingKeyParams';

export interface ModelInterface {
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
      actionParams?: object,
      additionalParams?: any
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

  // getSpecificFields(
  //   fields: string[],
  //   filterType: string,
  //   dataToFilter: string | object | object[]
  // ): void;

  setBaseUrl(URL: string, connectionType: string): any;

  setErrorInterceptor(errorText: string | number, callback: (...args: any) => any): void
}
