// chat.controller.ts
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { User } from '../users/user.model';
import { Chat } from '../chat/chat.model';
import { chatDto } from './dto/chat.dto';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async sendChat(@Body() chatDto: { sender: User, recipient: User, message: string,created_at:Date,deleted_at:Date }): Promise<Chat> {
    const { sender, recipient, message,created_at,deleted_at } = chatDto;
    return this.chatService.sendChat(sender, recipient, message,created_at,deleted_at);
  }

  @Get(':userId')
  async getChatsForUser(@Param('userId') userId: string): Promise<Chat[]> {
    return this.chatService.getChatsForUser(userId);
  }
}
