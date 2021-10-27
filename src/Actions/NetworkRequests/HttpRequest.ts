import axios, { Method } from 'axios';
import { ActionResult } from '../ActionResponses/ActionResult';
import { ActionError } from '../ActionResponses/ActionError';
import { ActionParameters } from '../Interfaces/ActionParameters';
import { getCookie, GlobalVariables, deleteCookie, setCookie } from '../../GlobalVariables';

let isRefreshing = false;
let refreshSubscribers: any[] = [];

export class HttpRequest {
  actionResult: ActionResult;
  actionError: ActionError;

  constructor() {
    this.actionResult = {} as ActionResult;
    this.actionError = {} as ActionError;
  }

  subscribeTokenRefresh(cb: any): void {
    refreshSubscribers.push(cb);
  }

  onRefreshed(token: any): void {
    refreshSubscribers.map((cb) => cb(token));
  }

  refreshAccessToken(serviceName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (sessionStorage.getItem('umt')) {
        let domain = GlobalVariables.httpBaseUrl
          ? GlobalVariables.httpBaseUrl
          : GlobalVariables.authBaseUrl;
        delete axios.defaults.headers.Authorization;
        deleteCookie(serviceName);
        axios({
          url: `${domain}/auth/User/loginToService`,
          method: 'POST',
          data: {
            service_name: serviceName,
            token: sessionStorage.getItem('umt')
          }
        })
          .then((response) => {
            resolve(response.data.action_result.data);
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        reject(new ActionError('Session expired!', 401).getMessage());
      }
    });
  }

  axiosConnect(
    serviceName: string,
    modelName: string,
    actionName: string,
    httpMethod: Method,
    actionParameters: ActionParameters | undefined,
    tokenName?: string
  ): Promise<any> {
    let domain = GlobalVariables.httpBaseUrl
      ? GlobalVariables.httpBaseUrl
      : GlobalVariables.authBaseUrl;
    let userTokenName = tokenName ? tokenName : GlobalVariables.tokenUST;
    let instance = axios.create();
    if (
      actionName !== 'registerByEmailAndPassword' &&
      actionName !== 'loginByEmailAndPassword' &&
      actionName !== 'loginToService'
    ) {
      instance.defaults.headers.common['Authorization'] = getCookie(userTokenName);
    }
    instance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        const { config } = error;
        const originalRequest = config;
        if (
          error.response.data.action_error.code === 401 &&
          error.response.data.action_error.message === 'Token expired!'
        ) {
          if (!isRefreshing) {
            isRefreshing = true;
            this.refreshAccessToken(serviceName).then((newToken) => {
              isRefreshing = false;
              this.onRefreshed(newToken);
            });
          }
          return new Promise((resolve, reject) => {
            this.subscribeTokenRefresh((token: any) => {
              originalRequest.headers['Authorization'] = token;
              deleteCookie(serviceName);
              setCookie(serviceName, token)
                .then(() => {
                  refreshSubscribers = [];
                  resolve(instance(originalRequest));
                })
                .catch((error) => {
                  reject(error);
                });
            });
          });
        } else {
          return Promise.reject(error);
        }
      }
    );
    return new Promise((resolve, reject) => {
      let data;
      switch (actionName) {
        case 'registerByEmailAndPassword':
        case 'loginByEmailAndPassword':
        case 'loginToService':
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
      if (GlobalVariables.httpBaseUrl || GlobalVariables.authBaseUrl) {
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
      } else {
        this.actionError = new ActionError('Укажите URL!');
        reject(this.actionError.getMessage());
      }
    });
  }
}
