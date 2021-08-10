import {AuthAction} from '../Auth/AuthAction'

export class EgalAuthConstructor extends AuthAction {
    egalAuth: AuthAction
    url: string
    constructor(authParams: { modelName: string, userName: string, password: string, url: string, connectionType: string }) {
        super(authParams.userName, authParams.password, authParams.modelName, authParams.connectionType)
        this.egalAuth = new AuthAction(authParams.userName, authParams.password, authParams.modelName, authParams.connectionType)
        this.url = authParams.url
        this.initAuthAction()
    }
    initAuthAction(){
        this.egalAuth.setBaseURL(this.url)
        return this.egalAuth
    }
}
