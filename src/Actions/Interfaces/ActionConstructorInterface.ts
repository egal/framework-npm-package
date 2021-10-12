export interface ActionConstructorInterface {
  getMetadata(microserviceName: string, modelName: string): this;

  getItems(microserviceName: string, modelName: string): this;

  getItem(microserviceName: string, modelName: string, id: string | number): this;

  create(microserviceName: string, modelName: string, actionParams: object): this;

  update(microserviceName: string, modelName: string, actionParams: object): this;

  delete(microserviceName: string, modelName: string, actionParams: object): this;

  createMany(microserviceName: string, modelName: string, actionParams: object): this;

  updateMany(microserviceName: string, modelName: string, actionParams: object): this;

  updateManyWithFilter(microserviceName: string, modelName: string, actionParams: object): this;

  deleteManyWithFilter(microserviceName: string, modelName: string, actionParams: object): this;

  custom(
    microserviceName: string,
    modelName: string,
    actionName: string,
    actionParams: object
  ): this;

  getCount(microserviceName: string, modelName: string): this;

  filter(filterObject: object): this;

  withs(withs: Array<string>): this;

  order(orders: string[][] | undefined): this;

  setPagination(perPage: number, page: number): this;
}
