"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketRequest = void 0;
const uuid_1 = require("uuid");
const ActionResult_1 = require("../ActionResponses/ActionResult");
const ActionError_1 = require("../ActionResponses/ActionError");
const GenerateJSON_1 = require("./GenerateJSON");
const ActionStartProcessing_1 = require("../ActionResponses/ActionStartProcessing");
const Observer_1 = require("./SocketConnection/Observer");
const GlobalVariables_1 = require("../../GlobalVariables");
const stomp_js_1 = require("stompjs/lib/stomp.js");
const observer = Observer_1.EventObserver.getInstance();
let client;
class SocketRequest {
    constructor(microserviceName, modelName, actionName, actionParameters, channelParameters) {
        this.type = "action";
        this.serviceName = microserviceName;
        this.modelName = modelName;
        this.actionName = actionName;
        this.channelParameters = channelParameters;
        this.actionParameters = actionParameters;
        this.tokenUst = GlobalVariables_1.GlobalVariables.tokenUST;
        this.uuid = uuid_1.v4();
        this.token = null;
        this.authOptions = new GenerateJSON_1.GenerateJSON().generateJSONObj(this.type, this.serviceName, this.modelName, this.actionName, this.actionParameters, this.token, this.uuid);
        this.options = new GenerateJSON_1.GenerateJSON().generateJSONObj(this.type, this.serviceName, this.modelName, this.actionName, this.actionParameters, this.tokenUst, this.uuid);
        this.actionResult = {};
        this.actionError = {};
        this.receivedItems = [];
        this.setObserver();
    }
    setObserver() {
        observer.subscribe("disconnect", () => {
            this.socketDisconnect();
        });
    }
    initSocketConnect() {
        if (GlobalVariables_1.GlobalVariables.socketBaseUrl || GlobalVariables_1.GlobalVariables.authBaseUrl) {
            let domain;
            let options;
            let routingKey;
            if (this.actionName === "registerByEmailAndPassword" ||
                this.actionName === "loginByEmailAndPassword" ||
                this.actionName === "loginToService") {
                domain = GlobalVariables_1.GlobalVariables.authBaseUrl;
                options = JSON.stringify(this.authOptions);
            }
            else {
                domain = GlobalVariables_1.GlobalVariables.socketBaseUrl;
                options = JSON.stringify(this.options);
            }
            routingKey =
                this.serviceName +
                    "." +
                    this.modelName +
                    "." +
                    this.actionName +
                    "." +
                    this.type;
            let topicKey = routingKey.toString();
            let uuid = JSON.parse(options).uuid;
            client = stomp_js_1.Stomp.client("ws://" + domain + ":15674/ws");
            const on_connect = (x) => {
                client.send("/topic/" + topicKey, { "content-type": "text/plain" }, options);
                let rabbitConnection = client.subscribe("/queue/" + uuid, (message) => {
                    if (message.body) {
                        let result = JSON.parse(message.body);
                        let actionName = result.action_message.action_name;
                        let modelName = result.action_message.model_name;
                        let receivedItems;
                        if (result.type === "start_processing") {
                            const actionStartProcessing = new ActionStartProcessing_1.ActionStartProcessing("Start Processing");
                            receivedItems = actionStartProcessing.getData();
                            observer.broadcast(receivedItems, actionName, modelName);
                        }
                        else if (result.type === "action_result") {
                            const actionResult = new ActionResult_1.ActionResult(result.data, actionName, modelName);
                            receivedItems = actionResult.getData();
                            observer.broadcast(receivedItems, actionName, modelName);
                        }
                        else if (result.type === "action_error") {
                            if (result.message === "Token expired!") {
                                this.refreshToken();
                            }
                            const actionError = new ActionError_1.ActionError(result.message, result.code).getMessage();
                            observer.broadcast(actionError, "error", modelName);
                        }
                    }
                    else {
                        const actionError = new ActionError_1.ActionError("got empty message").getMessage();
                        observer.broadcast(actionError, "error", this.modelName);
                    }
                    message.ack();
                }, { ack: "client" });
                if (this.channelParameters) {
                    let eventConnection = client.subscribe("/topic/" + topicKey, (message) => {
                        if (message.body) {
                            let result = JSON.parse(message.body);
                            observer.broadcast(result.parameters.attributes, result.action_name, result.model_name);
                            message.ack();
                        }
                        else {
                            const actionError = new ActionError_1.ActionError("got empty message").getMessage();
                            observer.broadcast(actionError, "error", this.modelName);
                        }
                    }, { ack: "client" });
                }
            };
            const on_error = (error) => {
                const actionError = new ActionError_1.ActionError(error).getMessage();
                observer.broadcast(actionError, "error", this.modelName);
            };
            // client.connect(this.userName, this.password, on_connect, on_error, "/");
        }
        else {
            const actionError = new ActionError_1.ActionError("Укажите URL!", 100);
            this.receivedItems = actionError.getMessage();
            observer.broadcast(this.receivedItems, "error", this.modelName);
        }
    }
    socketDisconnect() {
        client.disconnect(() => {
            observer.broadcast(`${this.modelName} disconnected`, "disconnect", this.modelName);
        });
    }
    refreshToken() {
        let currentToken = GlobalVariables_1.decipherJWT(GlobalVariables_1.GlobalVariables.tokenUST);
        let tokenExpirationTime = currentToken.alive_until;
    }
}
exports.SocketRequest = SocketRequest;
