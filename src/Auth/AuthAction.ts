import { Method } from "axios";
import { HttpRequest } from "../Actions/NetworkRequests/HttpRequest";
import { SocketRequest } from "../Actions/NetworkRequests/SocketRequest";
import { AuthParams } from "./AuthParams";
import { GlobalVariables } from "../GlobalVariables";
import { ActionParameters } from "../Actions/Interfaces/ActionParameters";

let register = "registerByEmailAndPassword";
let auth = "loginByEmailAndPassword";
let loginIntoService = "loginToService";

export class AuthAction {
  private readonly microserviceName: string;
  private readonly modelName: string;
  private httpMethod: Method;
  private httpRequest: HttpRequest;
  private requestAction: string;
  private readonly requestType: string;

  constructor(modelName: string, requestType: string) {
    this.microserviceName = "auth";
    this.modelName = modelName;
    this.httpMethod = "POST";
    this.requestAction = "";
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

  setNetworkRequest(
    userData: ActionParameters | undefined,
    requestType: string,
    tokenName?: string
  ) {
    return new Promise((resolve, reject) => {
      let authParams = new AuthParams().setAuthParams(userData);
      let socketRequest = new SocketRequest(
        this.microserviceName,
        requestType,
        this.modelName,
        authParams
      );
      if (this.requestType === "socket") {
        socketRequest.initSocketConnect();
      } else {
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
            let returnError = [error, "error", this.modelName];
            reject(returnError);
          });
      }
    });
  }

  registerNewUser(newUserData: ActionParameters | undefined) {
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

  authUser(createdUserData: ActionParameters | undefined) {
    return new Promise((resolve, reject) => {
      this.setNetworkRequest(createdUserData, auth)
        .then((data: any) => {
          sessionStorage.setItem("umt", data[0]);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  loginToService(userCred: ActionParameters | undefined, tokenName?: string) {
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
