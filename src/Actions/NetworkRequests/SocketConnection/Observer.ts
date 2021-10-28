export let observers: any[] = [];

export class EventObserver {
  private static instance: EventObserver | null;
  private modelName: string | undefined;

  private constructor() {}

  subscribe(modelName: string, fn: any): any {
    return (
      observers.findIndex((item) => item.modelName === modelName) === -1 &&
      observers.push({ modelName, fn })
    );
  }

  unsubscribe(modelName: string): any {
    return (observers = observers.filter((subscriber) => subscriber.modelName !== modelName));
  }

  broadcast(
    data: string[] | object[] | string | object,
    actionName?: string,
    receivedModelName?: string,
    actionMessage?: string | object
  ): any {
    observers.forEach((subscriber) => {
      if (subscriber.modelName === receivedModelName) {
        subscriber.fn(data, actionName, receivedModelName, actionMessage);
      }
    });
  }

  broadcastSocketDisconnect(modelName: string): any {
    observers.forEach((subscriber) => {
      if (subscriber.modelName === modelName) {
        subscriber.fn(modelName);
      }
    });
  }

  checkObservers(): any {
    console.log(observers);
  }

  static getInstance(): any {
    if (!this.instance) {
      this.instance = new EventObserver();
    }
    return this.instance;
  }
}
