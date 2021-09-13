"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthAction = void 0;
const HttpRequest_1 = require("../Actions/NetworkRequests/HttpRequest");
const SocketRequest_1 = require("../Actions/NetworkRequests/SocketRequest");
const AuthParams_1 = require("./AuthParams");
const GlobalVariables_1 = require("../GlobalVariables");
let register = 'registerByEmailAndPassword';
let auth = 'loginByEmailAndPassword';
let loginIntoService = 'loginToService';
class AuthAction {
    constructor(username, password, modelName, requestType, environment) {
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
    setEnvironment(environment) {
        GlobalVariables_1.GlobalVariables.environment = environment;
    }
    setNetworkRequest(userData, requestType, tokenName) {
        return new Promise((resolve, reject) => {
            let authParams = new AuthParams_1.AuthParams().setAuthParams(userData);
            let socketRequest = new SocketRequest_1.SocketRequest(this.username, this.password, this.microserviceName, requestType, this.modelName, authParams);
            if (this.requestType === 'socket') {
                socketRequest.initSocketConnect();
            }
            else {
                this.httpRequest
                    .axiosConnect(this.microserviceName, this.modelName, requestType, this.httpMethod, authParams, tokenName)
                    .then((response) => {
                    let typedResponse = response;
                    let action = typedResponse.splice(1, 1).toString();
                    let items = typedResponse.splice(0, 1);
                    let returnItems = [items, action, this.modelName];
                    resolve(returnItems);
                })
                    .catch((error) => {
                    let returnError = [error, 'error', this.modelName];
                    reject(returnError);
                });
            }
        });
    }
    registerNewUser(newUserData) {
        return new Promise((resolve, reject) => {
            this.setNetworkRequest(newUserData, register).then((data) => {
                resolve(data);
            }).catch((error) => {
                reject(error);
            });
        });
    }
    authUser(createdUserData) {
        return new Promise((resolve, reject) => {
            this.setNetworkRequest(createdUserData, auth).then((data) => {
                resolve(data);
            }).catch((error) => {
                reject(error);
            });
        });
    }
    loginToService(userCred, tokenName) {
        return new Promise((resolve, reject) => {
            this.setNetworkRequest(userCred, loginIntoService, tokenName).then((data) => {
                resolve(data);
                if (userCred !== undefined && userCred.service_name !== undefined)
                    try {
                        // @ts-ignore data is of type unknown
                        (0, GlobalVariables_1.setCookie)(userCred.service_name, data[0][0], 'react-native');
                        console.log('token set!');
                    }
                    catch (error) {
                        reject(error);
                    }
                // console.log(data, 'data from login to service')
            }).catch((error) => {
                reject(error);
            });
        });
    }
}
exports.AuthAction = AuthAction;
