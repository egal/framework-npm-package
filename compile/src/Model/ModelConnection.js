"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelConnection = void 0;
class ModelConnection {
    createConnection(connectionType, userRequest) {
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
exports.ModelConnection = ModelConnection;
