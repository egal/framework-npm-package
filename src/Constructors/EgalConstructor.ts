import { Model } from "../Model/Model";
import { EventObserver } from "../Actions/NetworkRequests/SocketConnection/Observer";

export class EgalConstructor extends Model {
  private readonly egalModel: Model;
  private egalObserver: EventObserver = EventObserver.getInstance();
  modelName: string;
  username: string;
  password: string;
  private readonly url: string;
  private readonly connectionType: string;

  constructor(modelParams: {
    modelName: string;
    username: string;
    password: string;
    url: string;
    connectionType: string;
    tokenName: string;
  }) {
    super(modelParams.username, modelParams.password, modelParams.modelName);
    this.modelName = modelParams.modelName;
    this.url = modelParams.url;
    this.username = modelParams.username;
    this.password = modelParams.password;
    this.connectionType = modelParams.connectionType;
    this.egalModel = new Model(this.username, this.password, this.modelName);
    this.initModel();
  }

  initModel() {
    this.egalModel.setBaseUrl(this.url, this.connectionType);
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
