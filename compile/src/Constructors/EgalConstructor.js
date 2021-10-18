"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EgalConstructor = void 0;
const Model_1 = require("../Model/Model");
const Observer_1 = require("../Actions/NetworkRequests/SocketConnection/Observer");
class EgalConstructor extends Model_1.Model {
    constructor(modelParams) {
        super(modelParams.username, modelParams.password, modelParams.modelName);
        this.egalObserver = Observer_1.EventObserver.getInstance();
        this.modelName = modelParams.modelName;
        this.url = modelParams.url;
        this.username = modelParams.username;
        this.password = modelParams.password;
        this.connectionType = modelParams.connectionType;
        this.egalModel = new Model_1.Model(this.username, this.password, this.modelName);
        this.initModel();
    }
    initModel() {
        this.egalModel.setBaseUrl(this.url, this.connectionType);
        return this.egalModel;
    }
    initModelObserver() {
        return new Promise((resolve, reject) => {
            this.egalObserver.subscribe(this.modelName, (data, actionName, modelName, actionMessage) => {
                let receivedData;
                if (actionName !== 'error') {
                    receivedData = [data[0], actionName, modelName, actionMessage];
                    resolve(receivedData);
                }
                else {
                    receivedData = [data[0], actionName, modelName, actionMessage];
                    reject(receivedData);
                }
            });
        });
    }
}
exports.EgalConstructor = EgalConstructor;
