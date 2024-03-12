import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, MessageBody } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway(3030, { cors: true, namespace: 'active_chats' })
export class WebsocketsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  private clients: Set<Socket> = new Set();

  @WebSocketServer() server: Server;

  afterInit(_server: Server) {
    console.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.clients.add(client);
    console.log(`Client connected:`, client.id, this.clients.size);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.clients.delete(client);
  }

  @SubscribeMessage('messageToServer')
  handleMessage(client: Socket, message: any): void {
    console.log(`Message from client ${client.id}: ${message}`);
    this.server.emit('messageToClient',message);
  }

  
  broadcastMessage(@MessageBody() message: any){
    this.clients.forEach((clientSocket) => {
    //  console.log('Attempting to bradcast', clientSocket.id);
      clientSocket.emit('message', message);
    })
  } 

}