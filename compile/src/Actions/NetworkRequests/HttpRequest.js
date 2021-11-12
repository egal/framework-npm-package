"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpRequest = void 0;
const axios_1 = __importDefault(require("axios"));
const ActionError_1 = require("../ActionResponses/ActionError");
const GlobalVariables_1 = require("../../GlobalVariables");
const MMKVStorage_1 = __importDefault(require("../../MMKVStorage"));
let isRefreshing = false;
let refreshSubscribers = [];
let initialRequest = undefined;
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
        axios_1.default.interceptors.response.use((response) => {
            return response;
        }, (error) => {
            const { config } = error;
            if (error.response.data.action_error.internal_code === 'umt_expired') {
                this.refreshMasterToken().then(() => {
                    return new Promise((resolve, reject) => {
                        this.refreshAccessToken(serviceName).then((result) => {
                            initialRequest.headers['Authorization'] = result;
                            GlobalVariables_1.deleteCookie(serviceName);
                            GlobalVariables_1.setCookie(serviceName, result)
                                .then(() => {
                                resolve(axios_1.default(initialRequest));
                            })
                                .catch((error) => {
                                reject(error);
                            });
                        });
                    });
                });
            }
            else {
                return Promise.reject(error);
            }
        });
        return new Promise((resolve, reject) => {
            if (MMKVStorage_1.default.getString('umt')) {
                let domain = GlobalVariables_1.GlobalVariables.httpBaseUrl
                    ? GlobalVariables_1.GlobalVariables.httpBaseUrl
                    : GlobalVariables_1.GlobalVariables.authBaseUrl;
                delete axios_1.default.defaults.headers.Authorization;
                GlobalVariables_1.deleteCookie(serviceName);
                axios_1.default({
                    url: `${domain}/auth/User/loginToService`,
                    method: 'POST',
                    data: {
                        service_name: serviceName,
                        token: MMKVStorage_1.default.getString('umt')
                    }
                })
                    .then((response) => {
                    resolve(response.data.action_result.data);
                })
                    .catch((error) => {
                    reject(error);
                });
            }
            else {
                reject(new ActionError_1.ActionError('Session expired!', 401).getMessage());
            }
        });
    }
    refreshMasterToken() {
        return new Promise((resolve, reject) => {
            if (MMKVStorage_1.default.getString('umrt')) {
                let domain = GlobalVariables_1.GlobalVariables.httpBaseUrl;
                delete axios_1.default.defaults.headers.Authorization;
                axios_1.default({
                    url: `${domain}/auth/User/refreshUserMasterToken`,
                    method: 'POST',
                    data: {
                        token: MMKVStorage_1.default.getString('umrt')
                    }
                })
                    .then((response) => {
                    MMKVStorage_1.default.set('umrt', response.data.action_result.data.user_master_refresh_token);
                    MMKVStorage_1.default.set('umt', response.data.action_result.data.user_master_token);
                    resolve(response.data.action_result.data);
                })
                    .catch((error) => {
                    reject(error);
                });
            }
            else {
                reject(new ActionError_1.ActionError('Session expired!', 401).getMessage());
            }
        });
    }
    axiosConnect(serviceName, modelName, actionName, httpMethod, actionParameters, tokenName) {
        let domain = GlobalVariables_1.GlobalVariables.httpBaseUrl
            ? GlobalVariables_1.GlobalVariables.httpBaseUrl
            : GlobalVariables_1.GlobalVariables.authBaseUrl;
        let userTokenName = tokenName ? tokenName : GlobalVariables_1.GlobalVariables.tokenUST;
        let instance = axios_1.default.create();
        if (actionName !== 'register' &&
            actionName !== 'login' &&
            actionName !== 'loginToService' &&
            actionName !== 'loginAndGetRefreshToken') {
            instance.defaults.headers.common['Authorization'] = GlobalVariables_1.getCookie(userTokenName);
        }
        instance.interceptors.response.use((response) => {
            return response;
        }, (error) => {
            const { config } = error;
            const originalRequest = config;
            initialRequest = originalRequest;
            if (error.response.data.action_error.code === 401 &&
                error.response.data.action_error.internal_code === 'ust_expired') {
                if (!isRefreshing) {
                    isRefreshing = true;
                    this.refreshAccessToken(serviceName).then((newToken) => {
                        isRefreshing = false;
                        this.onRefreshed(newToken);
                    });
                }
                return new Promise((resolve, reject) => {
                    this.subscribeTokenRefresh((token) => {
                        originalRequest.headers['Authorization'] = token;
                        GlobalVariables_1.deleteCookie(serviceName);
                        GlobalVariables_1.setCookie(serviceName, token)
                            .then(() => {
                            resolve(instance(originalRequest));
                            refreshSubscribers = [];
                        })
                            .catch((error) => {
                            reject(error);
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
                case 'register':
                case 'login':
                case 'loginToService':
                case 'loginAndGetRefreshToken':
                case 'getItems':
                case 'getItem':
                case 'delete':
                case 'getCount':
                case 'updateManyRaw':
                case 'deleteManyRaw':
                    data = actionParameters;
                    break;
                case 'createMany':
                case 'deleteMany':
                case 'updateMany':
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
                    data: data
                })
                    .then((response) => {
                    resolve(response);
                })
                    .catch((error) => {
                    reject(error.response);
                });
            }
            else {
                this.actionError = new ActionError_1.ActionError('Укажите URL!');
                reject(this.actionError.getMessage());
            }
        });
    }
}
exports.HttpRequest = HttpRequest;
