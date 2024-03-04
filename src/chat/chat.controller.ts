import { Controller, Get, Post, Body } from '@nestjs/common';

import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('bulk')
  async create(@Body() createChatDto: CreateChatDto)  {
    return this.chatService.create(createChatDto);
    
  }

  @Get('flattened')
  async findAll(): Promise<any[]> {
    return this.chatService.findAll();
  }
}
