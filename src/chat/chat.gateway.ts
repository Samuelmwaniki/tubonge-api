import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'ws';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('sendChat')
  handleChat(@MessageBody() message: string): void {
    this.server.clients.forEach(client => {
      client.send(JSON.stringify({ event: 'newChat', data: message }));
    });
  }
}
