import {OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";

@WebSocketGateway()
export class Sockets implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server;

    handleConnection(socket): any {
    }

    handleDisconnect(socket): any {
    }



}
