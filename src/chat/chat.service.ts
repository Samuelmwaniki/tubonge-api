import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from './schemas/chat.schema';
import { CreateChatDto } from './dto/create-chat.dto';


@Injectable()
export class ChatService {
  constructor(@InjectModel(Chat.name) private chatModel: Model<ChatDocument>) {}

  async create(createChatDto: CreateChatDto): Promise<Chat> {
    return await this.chatModel.create(createChatDto);
  }

  async get(recipientId: string, senderId: string) {
    // console.log('SENDER & RECIPIENT : ', senderId, recipientId);
    const chats = await this.chatModel.find({ recipient: recipientId, sender: senderId});
    // console.log('CHATS : ', chats);
    return chats;
  }

  async findAll(): Promise<Chat[]> {
    return this.chatModel.find().exec();
  }
}
