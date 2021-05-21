"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthAction = void 0;
const HttpRequest_1 = require("../Actions/NetworkRequests/HttpRequest");
const SocketRequest_1 = require("../Actions/NetworkRequests/SocketRequest");
const AuthParams_1 = require("./AuthParams");
const GlobalVariables_1 = require("../GlobalVariables");
const Observer_1 = require("../Actions/NetworkRequests/SocketConnection/Observer");
let register = 'registerByEmailAndPassword';
let auth = 'loginByEmailAndPassword';
let loginIntoService = 'loginToService';
const observer = new Observer_1.EventObserver();
class AuthAction {
    constructor(username, password, modelName, requestType) {
        this.microserviceName = 'auth';
        this.modelName = modelName;
        this.username = username;
        this.password = password;
        this.httpMethod = 'POST';
        this.requestAction = '';
        this.requestType = requestType;
        this.httpRequest = new HttpRequest_1.HttpRequest();
    }
    setBaseURL(baseAuthURL) {
        GlobalVariables_1.GlobalVariables.authBaseUrl = baseAuthURL;
    }
    setTokenUST(tokenUST) {
        GlobalVariables_1.GlobalVariables.tokenUST = tokenUST;
    }
    setTokenUMT(tokenUMT) {
        GlobalVariables_1.GlobalVariables.tokenUMT = tokenUMT;
    }
    setAxiosRequest(actionName, params) {
        this.httpRequest
            .axiosConnect(this.microserviceName, this.modelName, actionName, this.httpMethod, params)
            .then((response) => {
            let typedResponse = response;
            let action = typedResponse.splice(1, 1).toString();
            let items = typedResponse.splice(0, 1);
            observer.broadcast(items, action, this.modelName);
            return response;
        })
            .catch((error) => {
            observer.broadcast(error, '', this.modelName);
            return error;
        });
    }
    registerNewUser(newUserData) {
        let authParams = new AuthParams_1.AuthParams().setAuthParams(newUserData);
        let socketRequest = new SocketRequest_1.SocketRequest(this.username, this.password, this.microserviceName, register, this.modelName, authParams);
        if (this.requestType === 'socket')
            socketRequest.initSocketConnect();
        this.setAxiosRequest(register, authParams);
    }
    authUser(createdUserData) {
        let authParams = new AuthParams_1.AuthParams().setAuthParams(createdUserData);
        let socketRequest = new SocketRequest_1.SocketRequest(this.username, this.password, this.microserviceName, auth, this.modelName, authParams);
        if (this.requestType === 'socket')
            socketRequest.initSocketConnect();
        this.setAxiosRequest(auth, authParams);
    }
    loginToService(userCred) {
        let authParams = new AuthParams_1.AuthParams().setAuthParams(userCred);
        let socketRequest = new SocketRequest_1.SocketRequest(this.username, this.password, this.microserviceName, loginIntoService, this.modelName, authParams);
        if (this.requestType === 'socket')
            socketRequest.initSocketConnect();
        this.setAxiosRequest(loginIntoService, authParams);
    }
}
exports.AuthAction = AuthAction;
