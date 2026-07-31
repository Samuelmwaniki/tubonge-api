import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway(3030, { cors: true, namespace: 'active_chats' })
export class WebsocketsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private clients: Set<Socket> = new Set();

  // NEW: online-presence tracking.
  // A user can have more than one open tab/socket, so we keep a set of
  // socket ids per userId and only mark them offline once every socket
  // for that user has disconnected.
  private userSockets: Map<string, Set<string>> = new Map(); // userId -> socket ids
  private socketToUser: Map<string, string> = new Map(); // socket id -> userId

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

    const userId = this.socketToUser.get(client.id);
    if (userId) {
      this.socketToUser.delete(client.id);
      const sockets = this.userSockets.get(userId);
      sockets?.delete(client.id);

      if (!sockets || sockets.size === 0) {
        this.userSockets.delete(userId);
        this.server.emit('userStatus', { userId, online: false });
      }
    }
  }

  // NEW: the client calls socket.emit('identify', userId) right after
  // connecting, so the gateway knows which user this socket belongs to.
  @SubscribeMessage('identify')
  handleIdentify(client: Socket, userId: string): void {
    if (!userId) {
      return;
    }

    this.socketToUser.set(client.id, userId);
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)!.add(client.id);

    // Tell everyone this user just came online.
    this.server.emit('userStatus', { userId, online: true });

    // Tell the newly-connected client who is already online, so it can
    // paint correct status dots immediately instead of waiting for
    // individual userStatus events.
    client.emit('onlineUsers', Array.from(this.userSockets.keys()));
  }

  // NEW: sends an event only to the socket(s) belonging to one specific
  // user, instead of broadcasting to everyone. Used for typing indicators
  // and read receipts so we don't spam every connected client.
  emitToUser(userId: string, event: string, payload: any) {
    const socketIds = this.userSockets.get(userId);
    if (!socketIds) {
      return;
    }
    socketIds.forEach((id) => this.server.to(id).emit(event, payload));
  }

  // NEW: relays "X is typing" between two specific users.
  @SubscribeMessage('typing')
  handleTyping(
    client: Socket,
    payload: { senderId: string; recipientId: string; isTyping: boolean },
  ): void {
    if (!payload?.recipientId) {
      return;
    }
    this.emitToUser(payload.recipientId, 'typing', {
      senderId: payload.senderId,
      isTyping: payload.isTyping,
    });
  }

  @SubscribeMessage('messageToServer')
  handleMessage(client: Socket, message: any): void {
    console.log(`Message from client ${client.id}: ${message}`);
    this.server.emit('messageToClient', message);
  }

  broadcastMessage(@MessageBody() message: any) {
    this.clients.forEach((clientSocket) => {
      clientSocket.emit('message', message);
    });
  }
}