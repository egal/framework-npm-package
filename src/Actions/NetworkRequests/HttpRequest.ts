import axios, {Method} from 'axios';
import {ActionResult} from '../ActionResponses/ActionResult';
import {ActionError} from '../ActionResponses/ActionError';
import {ActionParameters} from '../Interfaces/ActionParameters';
import {GlobalVariables, getCookie, setCookie} from '../../GlobalVariables';
import {ParametersInterface} from "./ParametersInterface";
import {log} from "util";

export class HttpRequest {
    actionResult: ActionResult;
    actionError: ActionError;
    httpMethod: Method;

    constructor() {
        this.httpMethod = 'POST';
        this.actionResult = {} as ActionResult;
        this.actionError = {} as ActionError;
    }

    refreshAccessToken() {
        if (getCookie('umt')) {
            let domain = GlobalVariables.httpBaseUrl ? GlobalVariables.httpBaseUrl : GlobalVariables.authBaseUrl
            delete axios.defaults.headers.Authorization;
            axios({
                url: `${domain}/auth/User/loginToService`,
                method: this.httpMethod,
                data: {
                    service_name: 'monolit',
                    token: getCookie('umt')
                }
            })
                .then((response) => {
                    // @ts-ignore
                    setCookie('mandate', response.action_result.data)
                    return getCookie('mandate')
                })
                .catch((error) => {
                    return error
                });
        } else {
            return new ActionError('Session expired!', 401).getMessage()
        }
    }

    axiosConnect(
        serviceName: string,
        modelName: string,
        actionName: string,
        httpMethod: string,
        actionParameters: ActionParameters | undefined
    ) {
        return new Promise((resolve, reject) => {
            if (actionName !== 'registerByEmailAndPassword' &&
                actionName !== 'loginByEmailAndPassword' &&
                actionName !== 'loginToService' &&
                actionName !== 'getItems'
            ) {
                axios.interceptors.request.use(
                    config => {
                        const token = getCookie('mandate');
                        if (token) {
                            config.headers.Authorization = token;
                        }
                        return config;
                    },
                    error => Promise.reject(error)
                );
            }
            axios.interceptors.response.use((response) => {
                return response
            }, async (error) => {
                const originalRequest = error.config;
                if (error.response.data.action_error.code === 500 && error.response.data.action_error.message === 'Ошибка авторизации! Срок действия токена истек!' && !originalRequest._retry) {
                    originalRequest._retry = true;
                    const accessToken = await this.refreshAccessToken();
                    if (accessToken !== 'Session expired!') {
                        axios.defaults.headers.common['Authorization'] = accessToken;
                        return axios(originalRequest);
                    } else {
                        return new ActionError('Session expired!', 401).getMessage()
                    }
                }
                return Promise.reject(error);
            });
            let data
            if (
                actionName !== 'registerByEmailAndPassword' &&
                actionName !== 'loginByEmailAndPassword' &&
                actionName !== 'loginToService' &&
                actionName !== 'getItems' &&
                actionName !== 'getItem' &&
                actionName !== 'delete'
            ) {
                const parameters: ParametersInterface = {attributes: {}};
                parameters.attributes = actionParameters;
                data = parameters;
            } else {
                data = actionParameters
            }
            if (GlobalVariables.httpBaseUrl || GlobalVariables.authBaseUrl) {
                let domain = GlobalVariables.httpBaseUrl ? GlobalVariables.httpBaseUrl : GlobalVariables.authBaseUrl
                axios({
                    url: `${domain}/${serviceName}/${modelName}/${actionName}`,
                    method: this.httpMethod,
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
                        this.actionError = new ActionError(error.response.data.error_message, error.response.status);
                        reject(this.actionError.getMessage());
                    }).then(() => {

                });
            } else {
                this.actionError = new ActionError('Укажите URL!');
                reject(this.actionError.getMessage());
            }
        });
    }
}
