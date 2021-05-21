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
class HttpRequest {
    constructor() {
        this.httpMethod = 'POST';
        this.actionResult = {};
        this.actionError = {};
    }
    refreshAccessToken() {
        if (GlobalVariables_1.getCookie('umt')) {
            let domain = GlobalVariables_1.GlobalVariables.httpBaseUrl ? GlobalVariables_1.GlobalVariables.httpBaseUrl : GlobalVariables_1.GlobalVariables.authBaseUrl;
            delete axios_1.default.defaults.headers.Authorization;
            axios_1.default({
                url: `${domain}/auth/User/loginToService`,
                method: this.httpMethod,
                data: {
                    service_name: 'monolit',
                    token: GlobalVariables_1.getCookie('umt')
                }
            })
                .then((response) => {
                // @ts-ignore
                GlobalVariables_1.setCookie('mandate', response.action_result.data);
                return GlobalVariables_1.getCookie('mandate');
            })
                .catch((error) => {
                return error;
            });
        }
        else {
            return new ActionError_1.ActionError('Session expired!', 401).getMessage();
        }
    }
    axiosConnect(serviceName, modelName, actionName, httpMethod, actionParameters) {
        return new Promise((resolve, reject) => {
            if (actionName !== 'registerByEmailAndPassword' &&
                actionName !== 'loginByEmailAndPassword' &&
                actionName !== 'loginToService' &&
                actionName !== 'getItems') {
                axios_1.default.interceptors.request.use(config => {
                    const token = GlobalVariables_1.getCookie('mandate');
                    if (token) {
                        config.headers.Authorization = token;
                    }
                    return config;
                }, error => Promise.reject(error));
            }
            axios_1.default.interceptors.response.use((response) => {
                return response;
            }, async (error) => {
                const originalRequest = error.config;
                if (error.response.data.action_error.code === 500 && error.response.data.action_error.message === 'Ошибка авторизации! Срок действия токена истек!' && !originalRequest._retry) {
                    originalRequest._retry = true;
                    const accessToken = await this.refreshAccessToken();
                    if (accessToken !== 'Session expired!') {
                        axios_1.default.defaults.headers.common['Authorization'] = accessToken;
                        return axios_1.default(originalRequest);
                    }
                    else {
                        return new ActionError_1.ActionError('Session expired!', 401).getMessage();
                    }
                }
                return Promise.reject(error);
            });
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
                let domain = GlobalVariables_1.GlobalVariables.httpBaseUrl ? GlobalVariables_1.GlobalVariables.httpBaseUrl : GlobalVariables_1.GlobalVariables.authBaseUrl;
                axios_1.default({
                    url: `${domain}/${serviceName}/${modelName}/${actionName}`,
                    method: this.httpMethod,
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
                }).then(() => {
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
