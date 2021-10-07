export let observers: any[] = [];

export class EventObserver {
  private static instance: EventObserver | null;
  private modelName: string | undefined;

  private constructor() {}

  subscribe(modelName: string, fn: any) {
    return (
      observers.findIndex((item) => item.modelName === modelName) === -1 &&
      observers.push({ modelName, fn })
    );
  }

  unsubscribe(modelName: string) {
    return (observers = observers.filter(
      (subscriber) => subscriber.modelName !== modelName
    ));
  }

  broadcast(
    data: string[] | object[] | string | object,
    actionName?: string,
    receivedModelName?: string,
    actionMessage?: string | object
  ) {
    observers.forEach((subscriber) => {
      if (subscriber.modelName === receivedModelName) {
        subscriber.fn(data, actionName, receivedModelName, actionMessage);
      }
    });
  }

  broadcastSocketDisconnect(modelName: string) {
    observers.forEach((subscriber) => {
      if (subscriber.modelName === modelName) {
        subscriber.fn(modelName);
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
