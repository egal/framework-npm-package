export let observers: any[] = [];

export class EventObserver {
  private static instance: EventObserver | null;
  private type: string | undefined;
  private modelName: string | undefined;
  setType(type: string) {
    this.type = type;
  }

  setModel(model: string) {
    this.modelName = model;
  }

  subscribe(modelName: string, fn: any) {
    return observers.findIndex((item) => item.modelName === modelName) === -1 && observers.push({modelName, fn});
  }

  unsubscribe(modelName: string) {
    return observers.filter((subscriber) => subscriber.modelName !== modelName);
  }

  broadcast(
    data: string[] | object[] | string | object,
    actionName: string,
    receivedModelName?: string
  ) {
    observers.forEach((subscriber) => {
      if (subscriber.modelName === receivedModelName) {
        subscriber.fn(data, actionName, receivedModelName);
      }
    });
  }

  checkObservers(): void {
    console.log(observers);
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EventObserver();
    }
    return this.instance;
  }
}
