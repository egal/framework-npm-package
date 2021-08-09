import { Method } from 'axios';
import { HttpRequest } from '../Actions/NetworkRequests/HttpRequest';
import { SocketRequest } from '../Actions/NetworkRequests/SocketRequest';
import { AuthParams } from './AuthParams';
import { GlobalVariables } from '../GlobalVariables';
import { ActionParameters } from '../Actions/Interfaces/ActionParameters';
import { EventObserver } from '../Actions/NetworkRequests/SocketConnection/Observer';
let register = 'registerByEmailAndPassword';
let auth = 'loginByEmailAndPassword';
let loginIntoService = 'loginToService';
const observer:EventObserver = EventObserver.getInstance();
export class AuthAction {
  private readonly microserviceName: string;
  private readonly modelName: string;
  private readonly username: string;
  private readonly password: string;
  private httpMethod: Method;
  private httpRequest: HttpRequest;
  private requestAction: string;
  private readonly requestType: string;
  constructor(username:string, password: string, modelName: string, requestType: string) {
    this.microserviceName = 'auth';
    this.modelName = modelName;
    this.username = username;
    this.password = password;
    this.httpMethod = 'POST';
    this.requestAction = '';
    this.requestType = requestType;
    this.httpRequest = new HttpRequest();
  }

  setBaseURL(baseAuthURL: string) {
    GlobalVariables.authBaseUrl = baseAuthURL;
  }

  setTokenUST(tokenUST: string) {
    GlobalVariables.tokenUST = tokenUST;
  }

  setTokenUMT(tokenUMT: string) {
    GlobalVariables.tokenUMT = tokenUMT;
  }
  setAxiosRequest(actionName: string, params: ActionParameters | undefined) {
    this.httpRequest
        .axiosConnect(this.microserviceName, this.modelName, actionName, this.httpMethod, params)
        .then((response) => {
          let typedResponse: (string | object)[] = response as (string | object)[];
          let action = typedResponse.splice(1, 1).toString();
          let items = typedResponse.splice(0, 1);
          observer.broadcast(items, action, this.modelName);
          return response;
        })
        .catch((error) => {
          observer.broadcast(error, 'error', this.modelName);
          return error;
        });
  }
  registerNewUser(newUserData: ActionParameters | undefined) {
    let authParams = new AuthParams().setAuthParams(newUserData);
    let socketRequest = new SocketRequest(
        this.username,
        this.password,
        this.microserviceName,
        register,
        this.modelName,
        authParams
    );
    if (this.requestType === 'socket') socketRequest.initSocketConnect();
    this.setAxiosRequest(register, authParams);
  }

  authUser(createdUserData: ActionParameters | undefined) {
    let authParams = new AuthParams().setAuthParams(createdUserData);
    let socketRequest = new SocketRequest(this.username, this.password, this.microserviceName, auth, this.modelName, authParams);
    if (this.requestType === 'socket') socketRequest.initSocketConnect();
    this.setAxiosRequest(auth, authParams);
  }

  loginToService(userCred: ActionParameters | undefined) {
    let authParams = new AuthParams().setAuthParams(userCred);
    let socketRequest = new SocketRequest(
        this.username,
        this.password,
        this.microserviceName,
        loginIntoService,
        this.modelName,
        authParams
    );
    if (this.requestType === 'socket') socketRequest.initSocketConnect();
    this.setAxiosRequest(loginIntoService, authParams);
  }
}
