// chat.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from './chat.model';
import { User } from '../users/user.model';
@Injectable()
export class ChatService {
  constructor(@InjectModel(Chat.name) private chatModel: Model<ChatDocument>) {}

  async sendChat(sender: User, recipient: User, message: string): Promise<Chat> {
    const newChat = new this.chatModel({ sender, recipient, message });
    return newChat.save();
  }

  async getChatsForUser(userId: string): Promise<Chat[]> {
    return this.chatModel.find({ $or: [{ 'sender._id': userId }, { 'recipient._id': userId }] }).exec();
  }
}
