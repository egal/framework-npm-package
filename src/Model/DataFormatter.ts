export class DataFormatter {
  receivedData: string[];
  formattedData: object[];
  allItems: object[];

  constructor(receivedData: string[], allItems: object[]) {
    this.receivedData = receivedData;
    this.formattedData = [];
    this.allItems = (allItems as any).items;
  }

  /**
   * функция фильтрует список айтемов и оставляет только указанные пользователем поля
   */
  // include() {
  //   for (const i in this.allItems) {
  //     this.formattedData.push(
  //       Object.fromEntries(
  //         Object.entries(this.allItems[i]).filter(([key, val]) => this.receivedData.includes(key))
  //       )
  //     );
  //   }
  //   return this.formattedData;
  // }

  /**
   * функция фильтрует список айтемов и удаляет только указанные пользователем поля
   *
   * Функции почти одинаковые, но я решила их разделить чтобы было лучше понятно что для чего используется
   */
  // exclude() {
  //   for (const i in this.allItems) {
  //     this.formattedData.push(
  //       Object.fromEntries(
  //         Object.entries(this.allItems[i]).filter(([key, val]) => !this.receivedData.includes(key))
  //       )
  //     );
  //   }
  //   return this.formattedData;
  // }
}
