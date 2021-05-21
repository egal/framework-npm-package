/**
 * Класс возвращает данные об ошибках с сервера
 */
export class ActionError {
  private code: number | undefined;
  private readonly message: string;

  constructor(message: string, code?: number | undefined) {
    this.message = message;
    this.code = code;
  }

  getMessage() {
    return this.message;
  }
}
