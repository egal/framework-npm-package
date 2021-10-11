"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpRequest = void 0;
const axios_1 = __importDefault(require("axios"));
const ActionError_1 = require("../ActionResponses/ActionError");
const GlobalVariables_1 = require("../../GlobalVariables");
let isRefreshing = false;
let refreshSubscribers = [];
class HttpRequest {
    constructor() {
        this.actionResult = {};
        this.actionError = {};
    }
    subscribeTokenRefresh(cb) {
        refreshSubscribers.push(cb);
    }
    onRefreshed(token) {
        refreshSubscribers.map((cb) => cb(token));
    }
    refreshAccessToken(serviceName) {
        return new Promise((resolve, reject) => {
            if (sessionStorage.getItem("umt")) {
                let domain = GlobalVariables_1.GlobalVariables.httpBaseUrl
                    ? GlobalVariables_1.GlobalVariables.httpBaseUrl
                    : GlobalVariables_1.GlobalVariables.authBaseUrl;
                delete axios_1.default.defaults.headers.Authorization;
                GlobalVariables_1.deleteCookie(serviceName);
                axios_1.default({
                    url: `${domain}/auth/User/loginToService`,
                    method: "POST",
                    data: {
                        service_name: serviceName,
                        token: sessionStorage.getItem("umt"),
                    },
                })
                    .then((response) => {
                    resolve(response.data.action_result.data);
                })
                    .catch((error) => {
                    reject(error);
                });
            }
            else {
                reject(new ActionError_1.ActionError("Session expired!", 401).getMessage());
            }
        });
    }
    axiosConnect(serviceName, modelName, actionName, httpMethod, actionParameters, tokenName) {
        let domain = GlobalVariables_1.GlobalVariables.httpBaseUrl
            ? GlobalVariables_1.GlobalVariables.httpBaseUrl
            : GlobalVariables_1.GlobalVariables.authBaseUrl;
        let userTokenName = tokenName ? tokenName : GlobalVariables_1.GlobalVariables.tokenUST;
        let instance = axios_1.default.create();
        if (actionName !== "registerByEmailAndPassword" &&
            actionName !== "loginByEmailAndPassword" &&
            actionName !== "loginToService") {
            instance.defaults.headers.common["Authorization"] =
                GlobalVariables_1.getCookie(userTokenName);
        }
        instance.interceptors.response.use((response) => {
            return response;
        }, (error) => {
            const { config } = error;
            const originalRequest = config;
            if (error.response.data.action_error.code === 401 &&
                error.response.data.action_error.message === "Token expired!") {
                if (!isRefreshing) {
                    isRefreshing = true;
                    this.refreshAccessToken(serviceName).then((newToken) => {
                        isRefreshing = false;
                        this.onRefreshed(newToken);
                    });
                }
                return new Promise((resolve, reject) => {
                    this.subscribeTokenRefresh((token) => {
                        originalRequest.headers["Authorization"] = token;
                        GlobalVariables_1.deleteCookie(serviceName);
                        GlobalVariables_1.setCookie(serviceName, token)
                            .then(() => {
                            refreshSubscribers = [];
                            resolve(instance(originalRequest));
                        })
                            .catch((error) => {
                            console.log(error);
                        });
                    });
                });
            }
            else {
                return Promise.reject(error);
            }
        });
        return new Promise((resolve, reject) => {
            let data;
            switch (actionName) {
                case "registerByEmailAndPassword":
                case "loginByEmailAndPassword":
                case "loginToService":
                case "getItems":
                case "getItem":
                case "delete":
                case "getCount":
                    data = actionParameters;
                    break;
                case "createMany":
                case "deleteMany":
                case "updateMany":
                    const actionManyParams = { objects: {} };
                    // @ts-ignore
                    actionManyParams.objects = actionParameters;
                    data = actionManyParams;
                    break;
                default:
                    const parameters = { attributes: {} };
                    // @ts-ignore
                    parameters.attributes = actionParameters;
                    data = parameters;
            }
            if (GlobalVariables_1.GlobalVariables.httpBaseUrl || GlobalVariables_1.GlobalVariables.authBaseUrl) {
                instance({
                    url: `${domain}/${serviceName}/${modelName}/${actionName}`,
                    method: httpMethod,
                    data: data,
                })
                    .then((response) => {
                    resolve(response);
                })
                    .catch((error) => {
                    reject(error.response);
                });
            }
            else {
                this.actionError = new ActionError_1.ActionError("Укажите URL!");
                reject(this.actionError.getMessage());
            }
        });
    }
}
exports.HttpRequest = HttpRequest;
