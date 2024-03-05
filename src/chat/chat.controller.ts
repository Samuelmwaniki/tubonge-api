import { Controller, Get, Post, Body, Param, Req, Res } from '@nestjs/common';

import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('')
  async create(@Body() createChatDto: CreateChatDto)  {
    return this.chatService.create(createChatDto);
    
  }

  @Get('')
  async index(@Req() req: any, @Res() res: any) {
    const result = await this.chatService.get(req.query['recipientId'], req.query['senderId']);
    return res.status(200).json({ data: result })
  }

  @Get('flattened')
  async findAll(): Promise<any[]> {
    return this.chatService.findAll();
  }
}
