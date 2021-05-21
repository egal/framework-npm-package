/**
 * Класс возвращает ответ, полученный сервером
 */
export class ActionResult {
  private readonly data: object;
  actionName?: string;
  modelName?: string;

  constructor(data: object, actionName?: string, modelName?: string) {
    this.data = data;
    this.actionName = actionName;
    this.modelName = modelName;
  }

  getData(): object {
    return [this.data, this.actionName, this.modelName];
  }
}
