/**
 * Класс возвращает данные об ошибках с сервера
 */
export class ActionError {
  code: number | undefined;
  message: string;

  constructor(message: string, code?: number | undefined) {
    this.message = message;
    this.code = code;
  }

  getMessage(): string {
    return this.message;
  }
}
