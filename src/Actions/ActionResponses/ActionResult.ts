/**
 * Класс возвращает ответ, полученный сервером
 */
export class ActionResult {
  data: object;
  actionName?: string;
  modelName?: string;
  actionMessage?: object;

  constructor(data: object, actionName?: string, modelName?: string, actionMessage?: object) {
    this.data = data;
    this.actionName = actionName;
    this.modelName = modelName;
    this.actionMessage = actionMessage;
  }

  getData(): Array<string | undefined | object> {
    return [this.data, this.actionName, this.modelName, this.actionMessage];
  }
}
