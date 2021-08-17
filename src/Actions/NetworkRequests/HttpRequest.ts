import axios, {Method} from 'axios';
import {ActionResult} from '../ActionResponses/ActionResult';
import {ActionError} from '../ActionResponses/ActionError';
import {ActionParameters} from '../Interfaces/ActionParameters';
import {deleteCookie, getCookie, GlobalVariables, setCookie} from '../../GlobalVariables';
import {ParametersInterface} from "./ParametersInterface";


// let isRefreshing = false;
// let refreshSubscribers: any[] = [];

export class HttpRequest {
    actionResult: ActionResult;
    actionError: ActionError;

    constructor() {
        this.actionResult = {} as ActionResult;
        this.actionError = {} as ActionError;
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

    axiosConnect(
        serviceName: string,
        modelName: string,
        actionName: string,
        httpMethod: Method,
        actionParameters: ActionParameters | undefined,
        tokenName?:string
    ) {
        let domain = GlobalVariables.httpBaseUrl ? GlobalVariables.httpBaseUrl : GlobalVariables.authBaseUrl
        let userTokenName = tokenName ? tokenName : GlobalVariables.tokenUST
        const instance = axios.create({
            headers: {
                'Authorization': getCookie(userTokenName)
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
            let data
            if (actionName !== 'registerByEmailAndPassword' &&
                actionName !== 'loginByEmailAndPassword' &&
                actionName !== 'loginToService' &&
                actionName !== 'getItems' &&
                actionName !== 'getItem' &&
                actionName !== 'createMany' &&
                actionName !== 'deleteMany' &&
                actionName !== 'updateMany' &&
                actionName !== 'delete') {
                const parameters = {attributes: {}};
                // @ts-ignore
                parameters.attributes = actionParameters;
                data = parameters;
            }else if (actionName === 'createMany' ||
                actionName === 'deleteMany' ||
                actionName === 'updateMany'
            ) {
                const actionManyParams = {objects: {}}
                // @ts-ignore
                actionManyParams.objects = actionParameters
                data = actionManyParams
            } else {
                data = actionParameters
            }
            if (GlobalVariables.httpBaseUrl || GlobalVariables.authBaseUrl) {
                instance({
                    url: `${domain}/${serviceName}/${modelName}/${actionName}`,
                    method: httpMethod,
                    data: data
                })
                    .then((response) => {
                        this.actionResult = new ActionResult(
                            response.data?.action_result.data,
                            response.data?.action_result.action_message.action_name,
                            response.data?.action_result.action_message.model_name
                        );
                        resolve(this.actionResult.getData());
                    })
                    .catch((error) => {
                        reject(error.response);
                    })
            } else {
                this.actionError = new ActionError('Укажите URL!');
                reject(this.actionError.getMessage());
            }
        });
    }
}
