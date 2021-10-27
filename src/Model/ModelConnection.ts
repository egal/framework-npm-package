export class ModelConnection {
  createConnection(connectionType: string, userRequest: any): any {
    switch (connectionType) {
      case 'axios':
        return userRequest.axiosConnect();
      case 'socket':
        return userRequest.socketConnect();
      default:
        return 'Unknown connection type!';
    }
  }
}
