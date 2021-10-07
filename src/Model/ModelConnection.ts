export class ModelConnection {
  createConnection(connectionType: string, userRequest: any) {
    switch (connectionType) {
      case "axios":
        return userRequest.axiosConnect();
      default:
        return "Unknown connection type!";
    }
  }
}
