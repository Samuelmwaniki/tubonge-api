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
    console.log(recipientId, senderId)
    const chats = await this.chatModel.find({
        $or: [
            { recipient: recipientId, sender: senderId },
            { recipient: senderId, sender: recipientId }
        ]
     // recipient: recipientId, sender: senderId,
    }).exec();
    return chats;
}

  async findAll(): Promise<Chat[]> {
    return this.chatModel.find().exec();
  }
}
