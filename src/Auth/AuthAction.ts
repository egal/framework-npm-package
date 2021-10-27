import { Method } from 'axios';
import { HttpRequest } from '../Actions/NetworkRequests/HttpRequest';
import { AuthParams } from './AuthParams';
import { GlobalVariables } from '../GlobalVariables';
import { ActionParameters } from '../Actions/Interfaces/ActionParameters';

let register = 'registerByEmailAndPassword';
let auth = 'loginByEmailAndPassword';
let loginIntoService = 'loginToService';

export class AuthAction {
  private microserviceName: string;
  private modelName: string;
  private httpMethod: Method;
  private httpRequest: HttpRequest;
  private requestAction: string;
  private requestType: string;

  constructor(modelName: string, requestType: string) {
    this.microserviceName = 'auth';
    this.modelName = modelName;
    this.httpMethod = 'POST';
    this.requestAction = '';
    this.requestType = requestType;
    this.httpRequest = new HttpRequest();
  }

  setBaseURL(baseAuthURL: string): void {
    GlobalVariables.authBaseUrl = baseAuthURL;
  }

  setTokenUST(tokenUST: string): void {
    GlobalVariables.tokenUST = tokenUST;
  }

  setTokenUMT(tokenUMT: string): void {
    GlobalVariables.tokenUMT = tokenUMT;
  }

  setNetworkRequest(
    userData: ActionParameters | undefined,
    requestType: string,
    tokenName?: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let authParams = new AuthParams().setAuthParams(userData);
      this.httpRequest
        .axiosConnect(
          this.microserviceName,
          this.modelName,
          requestType,
          this.httpMethod,
          authParams,
          tokenName
        )
        .then((response: any) => {
          let action = response.data.action.action_name;
          let items = response.data.action_result.data;
          let returnItems = [items, action, this.modelName];
          resolve(returnItems);
        })
        .catch((error) => {
          let returnError = [error, 'error', this.modelName];
          reject(returnError);
        });
    });
  }

  registerNewUser(newUserData: ActionParameters): Promise<any> {
    return new Promise((resolve, reject) => {
      this.setNetworkRequest(newUserData, register)
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  authUser(createdUserData: ActionParameters): Promise<any> {
    return new Promise((resolve, reject) => {
      this.setNetworkRequest(createdUserData, auth)
        .then((data: any) => {
          sessionStorage.setItem('umt', data[0]);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  loginToService(userCred: ActionParameters, tokenName?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.setNetworkRequest(userCred, loginIntoService, tokenName)
        .then((data: any) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
