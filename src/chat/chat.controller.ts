// chat.controller.ts
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { User } from '../users/user.model';
import { Chat } from '../chat/chat.model';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async sendChat(@Body() chatData: { sender: User, recipient: User, message: string }): Promise<Chat> {
    const { sender, recipient, message } = chatData;
    return this.chatService.sendChat(sender, recipient, message);
  }

  @Get(':userId')
  async getChatsForUser(@Param('userId') userId: string): Promise<Chat[]> {
    return this.chatService.getChatsForUser(userId);
  }
}
