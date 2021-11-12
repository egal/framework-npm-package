import { Model } from './Model';
import { EventObserver } from '../Actions/NetworkRequests/SocketConnection/Observer';

export class ReactConstructor extends Model {
  private readonly egalModel: Model;
  private egalObserver: EventObserver = EventObserver.getInstance();
  modelName: string;
  listenerFunction: Function;
  private readonly url: string;

  constructor(modelParams: { modelName: string; url: string; listenerFunction: Function }) {
    super(modelParams.modelName, '', '');
    this.modelName = modelParams.modelName;
    this.listenerFunction = modelParams.listenerFunction;
    this.url = modelParams.url;
    this.egalModel = new Model(this.modelName, '', '');
    this.initModel();
  }

  initModel() {
    this.egalModel.setBaseUrl(this.url);
    return this.egalModel;
  }

  initModelObserver() {
    this.egalObserver.subscribe(
      this.modelName,
      (data: any, actionName: string, modelName: string, actionMessage: object) => {
        const receivedData = [data[0], actionName, modelName, actionMessage];
        this.listenerFunction(receivedData);
      }
    );
  }
}
