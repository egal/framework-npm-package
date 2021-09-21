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
// let isRefreshing = false;
// let refreshSubscribers: any[] = [];
class HttpRequest {
    constructor() {
        this.actionResult = {};
        this.actionError = {};
    }
    // subscribeTokenRefresh(cb: any) {
    //     refreshSubscribers.push(cb);
    // }
    //
    // onRefreshed(token: any) {
    //     refreshSubscribers.map(cb => cb(token));
    // }
    //
    // refreshAccessToken() {
    //     return new Promise((resolve, reject) => {
    //         if (getCookie('umt')) {
    //             let domain = GlobalVariables.httpBaseUrl ? GlobalVariables.httpBaseUrl : GlobalVariables.authBaseUrl
    //             delete axios.defaults.headers.Authorization;
    //             deleteCookie('mandate')
    //             axios({
    //                 url: `${domain}/auth/User/loginToService`,
    //                 method: 'POST',
    //                 data: {
    //                     service_name: 'monolit',
    //                     token: getCookie('umt')
    //                 }
    //             })
    //                 .then((response) => {
    //                     resolve(response.data.action_result.data)
    //                 })
    //                 .catch((error) => {
    //                     reject(error)
    //                 });
    //         } else {
    //             reject(new ActionError('Session expired!', 401).getMessage())
    //         }
    //     })
    // }
    axiosConnect(serviceName, modelName, actionName, httpMethod, actionParameters, tokenName) {
        let domain = GlobalVariables_1.GlobalVariables.httpBaseUrl ? GlobalVariables_1.GlobalVariables.httpBaseUrl : GlobalVariables_1.GlobalVariables.authBaseUrl;
        let userTokenName = tokenName ? tokenName : GlobalVariables_1.GlobalVariables.tokenUST;
        const instance = axios_1.default.create({
            headers: {
                'Authorization': GlobalVariables_1.getCookie(userTokenName)
            }
        });
        // instance.interceptors.response.use(response => {
        //     return response;
        // }, error => {
        //     const {config} = error;
        //     const originalRequest = config;
        //     if (error.response.data.action_error.code === 401 && error.response.data.action_error.message === 'Token expired!') {
        //         if (!isRefreshing) {
        //             isRefreshing = true;
        //             this.refreshAccessToken()
        //                 .then(newToken => {
        //                     isRefreshing = false;
        //                     this.onRefreshed(newToken);
        //                 });
        //         }
        //         return new Promise((resolve, reject) => {
        //             this.subscribeTokenRefresh((token: any) => {
        //                 originalRequest.headers['Authorization'] = token;
        //                 deleteCookie('mandate')
        //                 setCookie('mandate', token)
        //                 refreshSubscribers = []
        //                 resolve(instance(originalRequest));
        //             });
        //         });
        //     } else {
        //         return Promise.reject(error);
        //     }
        // });
        return new Promise((resolve, reject) => {
            let data;
            switch (actionName) {
                case 'registerByEmailAndPassword':
                case 'loginByEmailAndPassword':
                case 'loginToService':
                case 'getItems':
                case 'getItem':
                case 'createMany':
                case 'deleteMany':
                case 'updateMany':
                case 'delete':
                case 'getCount':
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
                    var _a, _b, _c, _d;
                    this.actionResult = new ActionResult_1.ActionResult((_a = response.data) === null || _a === void 0 ? void 0 : _a.action_result.data, (_b = response.data) === null || _b === void 0 ? void 0 : _b.action_result.action_message.action_name, (_c = response.data) === null || _c === void 0 ? void 0 : _c.action_result.action_message.model_name, (_d = response.data) === null || _d === void 0 ? void 0 : _d.action_result.action_message);
                    resolve(this.actionResult.getData());
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
