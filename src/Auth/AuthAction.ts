import {Method} from 'axios';
import {HttpRequest} from '../Actions/NetworkRequests/HttpRequest';
import {SocketRequest} from '../Actions/NetworkRequests/SocketRequest';
import {AuthParams} from './AuthParams';
import {GlobalVariables} from '../GlobalVariables';
import {ActionParameters} from '../Actions/Interfaces/ActionParameters';

let register = 'registerByEmailAndPassword';
let auth = 'loginByEmailAndPassword';
let loginIntoService = 'loginToService';

export class AuthAction {
    private readonly microserviceName: string;
    private readonly modelName: string;
    private readonly username: string;
    private readonly password: string;
    private httpMethod: Method;
    private httpRequest: HttpRequest;
    private requestAction: string;
    private readonly requestType: string;
    private environment: string

    constructor(username: string, password: string, modelName: string, requestType: string, environment: string) {
        this.microserviceName = 'auth';
        this.modelName = modelName;
        this.username = username;
        this.password = password;
        this.httpMethod = 'POST';
        this.requestAction = '';
        this.requestType = requestType;
        this.httpRequest = new HttpRequest();
        this.environment = environment;
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

    setNetworkRequest(userData: ActionParameters | undefined, requestType: string, tokenName?:string){
        return new Promise((resolve, reject) => {
            let authParams = new AuthParams().setAuthParams(userData);
            let socketRequest = new SocketRequest(
                this.username,
                this.password,
                this.microserviceName,
                requestType,
                this.modelName,
                authParams
            );
            if (this.requestType === 'socket') {
                socketRequest.initSocketConnect();
            } else {
                this.httpRequest
                    .axiosConnect(this.microserviceName, this.modelName, requestType, this.httpMethod, this.environment, authParams, tokenName)
                    .then((response) => {
                        let typedResponse: (string | object)[] = response as (string | object)[];
                        let action = typedResponse.splice(1, 1).toString();
                        let items = typedResponse.splice(0, 1);
                        let returnItems = [items, action, this.modelName]
                        resolve(returnItems)
                    })
                    .catch((error) => {
                        let returnError = [error, 'error', this.modelName]
                        reject(returnError)
                    });
            }
        })
    }

    registerNewUser(newUserData: ActionParameters | undefined) {
        return new Promise((resolve, reject) => {
            this.setNetworkRequest(newUserData, register).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    authUser (createdUserData: ActionParameters | undefined) {
        return new Promise((resolve, reject) => {
            this.setNetworkRequest(createdUserData, auth).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    loginToService(userCred: ActionParameters | undefined, tokenName?:string) {
        return new Promise((resolve, reject) => {
            this.setNetworkRequest(userCred, loginIntoService, tokenName).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }
}
