/**
 * Класс возвращает сообщение о начале обработки запроса
 */
export class ActionStartProcessing {
  data: string;

  constructor(data: string) {
    this.data = data;
  }

  getData(): string {
    return this.data;
  }
}
