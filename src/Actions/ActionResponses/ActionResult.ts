/**
 * Класс возвращает ответ, полученный сервером
 */
export class ActionResult {
  private readonly data: object;
  actionName?: string;
  modelName?: string;
  actionMessage?: Object;

  constructor(
    data: object,
    actionName?: string,
    modelName?: string,
    actionMessage?: Object
  ) {
    this.data = data;
    this.actionName = actionName;
    this.modelName = modelName;
    this.actionMessage = actionMessage;
  }

  getData(): object {
    return [this.data, this.actionName, this.modelName, this.actionMessage];
  }
}
