import { ActionParameters } from '../Interfaces/ActionParameters';
import { GetItemsFilterParams } from '../GetItemsAction/GetItemsFilterParams';
import { ParametersInterface } from './ParametersInterface';

export class GenerateJSON {
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
  generateJSONObj(
    type: string,
    serviceName: string,
    modelName: string,
    actionName: string,
    actionParameters: ActionParameters | undefined,
    token: string | null,
    uuid: string
  ): any {
    const parametersCRUD: ParametersInterface = { attributes: {} };
    const parametersMany: ParametersInterface = { objects: {} };
    const parametersDeleteMany: ParametersInterface = { ids: [] };
    const parametersUpdateManyRaw: ParametersInterface = { filter: [], attributes: [] };
    const parametersDeleteManyRaw: ParametersInterface = { filter: [] };
    switch (actionName) {
      case 'create':
      case 'update':
      case 'delete':
        parametersCRUD.attributes = actionParameters;
        return {
          type: type,
          service_name: serviceName,
          model_name: modelName,
          action_name: actionName,
          parameters: parametersCRUD,
          token: token,
          uuid: uuid
        };
      case 'createMany':
      case 'updateMany':
        parametersMany.objects = actionParameters;
        return {
          type: type,
          service_name: serviceName,
          model_name: modelName,
          action_name: actionName,
          parameters: parametersMany,
          token: token,
          uuid: uuid
        };
      case 'deleteMany':
        parametersDeleteMany.ids = actionParameters;
        return {
          type: type,
          service_name: serviceName,
          model_name: modelName,
          action_name: actionName,
          parameters: parametersDeleteMany,
          token: token,
          uuid: uuid
        };
      case 'updateManyRaw':
        parametersUpdateManyRaw.filter = this.formFilter(actionParameters?.filter);
        parametersUpdateManyRaw.attributes = actionParameters?.attributes;
        return {
          type: type,
          service_name: serviceName,
          model_name: modelName,
          action_name: actionName,
          parameters: parametersUpdateManyRaw,
          token: token,
          uuid: uuid
        };
      case 'deleteManyRaw':
        parametersDeleteManyRaw.filter = this.formFilter(actionParameters?.filter);
        return {
          type: type,
          service_name: serviceName,
          model_name: modelName,
          action_name: actionName,
          parameters: parametersDeleteManyRaw,
          token: token,
          uuid: uuid
        };
      default:
        return {
          type: type,
          service_name: serviceName,
          model_name: modelName,
          action_name: actionName,
          parameters: actionParameters,
          token: token,
          uuid: uuid
        };
    }
  }

  formFilter(filterObj: (string | object)[] | undefined): (string | object)[] {
    const newFilterObj = new GetItemsFilterParams(filterObj);
    newFilterObj.checkFilterType();
    return newFilterObj.formFilterObject();
  }
}
