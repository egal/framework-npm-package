"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpRequest = void 0;
const axios_1 = __importDefault(require("axios"));
const ActionResult_1 = require("../ActionResponses/ActionResult");
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
        refreshSubscribers.map(cb => cb(token));
    }
    refreshAccessToken() {
        return new Promise((resolve, reject) => {
            if (GlobalVariables_1.getCookie('umt')) {
                let domain = GlobalVariables_1.GlobalVariables.httpBaseUrl ? GlobalVariables_1.GlobalVariables.httpBaseUrl : GlobalVariables_1.GlobalVariables.authBaseUrl;
                delete axios_1.default.defaults.headers.Authorization;
                GlobalVariables_1.deleteCookie('mandate');
                axios_1.default({
                    url: `${domain}/auth/User/loginToService`,
                    method: 'POST',
                    data: {
                        service_name: 'monolit',
                        token: GlobalVariables_1.getCookie('umt')
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
    axiosConnect(serviceName, modelName, actionName, httpMethod, actionParameters) {
        let domain = GlobalVariables_1.GlobalVariables.httpBaseUrl ? GlobalVariables_1.GlobalVariables.httpBaseUrl : GlobalVariables_1.GlobalVariables.authBaseUrl;
        const instance = axios_1.default.create({
            headers: {
                'Authorization': GlobalVariables_1.getCookie('mandate')
            }
        });
        instance.interceptors.response.use(response => {
            return response;
        }, error => {
            const { config } = error;
            const originalRequest = config;
            if (error.response.data.action_error.code === 401 && error.response.data.action_error.message === 'Token expired!') {
                if (!isRefreshing) {
                    isRefreshing = true;
                    this.refreshAccessToken()
                        .then(newToken => {
                        isRefreshing = false;
                        this.onRefreshed(newToken);
                    });
                }
                return new Promise((resolve, reject) => {
                    this.subscribeTokenRefresh((token) => {
                        originalRequest.headers['Authorization'] = token;
                        GlobalVariables_1.deleteCookie('mandate');
                        GlobalVariables_1.setCookie('mandate', token);
                        refreshSubscribers = [];
                        resolve(instance(originalRequest));
                    });
                });
            }
            else {
                return Promise.reject(error);
            }
        });
        return new Promise((resolve, reject) => {
            let data;
            if (actionName !== 'registerByEmailAndPassword' &&
                actionName !== 'loginByEmailAndPassword' &&
                actionName !== 'loginToService' &&
                actionName !== 'getItems' &&
                actionName !== 'getItem' &&
                actionName !== 'delete') {
                const parameters = { attributes: {} };
                parameters.attributes = actionParameters;
                data = parameters;
            }
            else {
                data = actionParameters;
            }
            if (GlobalVariables_1.GlobalVariables.httpBaseUrl || GlobalVariables_1.GlobalVariables.authBaseUrl) {
                instance({
                    url: `${domain}/${serviceName}/${modelName}/${actionName}`,
                    method: httpMethod,
                    data: data
                })
                    .then((response) => {
                    var _a, _b, _c;
                    this.actionResult = new ActionResult_1.ActionResult((_a = response.data) === null || _a === void 0 ? void 0 : _a.action_result.data, (_b = response.data) === null || _b === void 0 ? void 0 : _b.action_result.action_message.action_name, (_c = response.data) === null || _c === void 0 ? void 0 : _c.action_result.action_message.model_name);
                    resolve(this.actionResult.getData());
                })
                    .catch((error) => {
                    this.actionError = new ActionError_1.ActionError(error.response.data.error_message, error.response.status);
                    reject(this.actionError.getMessage());
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
