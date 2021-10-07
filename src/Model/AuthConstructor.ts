import { AuthAction } from "../Auth/AuthAction";

export class EgalAuthConstructor extends AuthAction {
  egalAuth: AuthAction;
  url: string;
  constructor(authParams: { modelName: string; url: string }) {
    super(authParams.modelName);
    this.egalAuth = new AuthAction(authParams.modelName);
    this.url = authParams.url;
    this.initAuthAction();
  }
  initAuthAction() {
    this.egalAuth.setBaseURL(this.url);
    return this.egalAuth;
  }
}
