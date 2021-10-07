import { Model } from "./Model";
import { EventObserver } from "../Actions/NetworkRequests/SocketConnection/Observer";

export class EgalConstructor extends Model {
  private readonly egalModel: Model;
  private egalObserver: EventObserver = EventObserver.getInstance();
  modelName: string;
  private readonly url: string;

  constructor(modelParams: {
    modelName: string;
    url: string;
    connectionType: string;
    tokenName: string;
  }) {
    super("", "", modelParams.modelName);
    this.modelName = modelParams.modelName;
    this.url = modelParams.url;
    this.egalModel = new Model("", "", this.modelName);
    this.initModel();
  }

  initModel() {
    this.egalModel.setBaseUrl(this.url);
    return this.egalModel;
  }
  initModelObserver() {
    return new Promise((resolve, reject) => {
      this.egalObserver.subscribe(
        this.modelName,
        (
          data: any,
          actionName: string,
          modelName: string,
          actionMessage: object
        ) => {
          let receivedData;
          if (actionName !== "error") {
            receivedData = [data[0], actionName, modelName, actionMessage];
            resolve(receivedData);
          } else {
            receivedData = [data[0], actionName, modelName, actionMessage];
            reject(receivedData);
          }
        }
      );
    });
  }
}
