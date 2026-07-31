import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from './schemas/chat.schema';
import { CreateChatDto } from './dto/create-chat.dto';
import { WebsocketsGateway } from 'src/gateway/websockets/websockets.gateway';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    private readonly chatGateway: WebsocketsGateway,
  ) {}

  async create(createChatDto: CreateChatDto): Promise<Chat> {
    const message = await this.chatModel.create(createChatDto);
    this.chatGateway.broadcastMessage(message);
    return message;
  }

  async get(recipientId: string, senderId: string) {
    const chats = await this.chatModel
      .find({
        $or: [
          { recipient: recipientId, sender: senderId },
          { recipient: senderId, sender: recipientId },
        ],
      })
      .exec();
    return chats;
  }

  async findAll(): Promise<Chat[]> {
    return this.chatModel.find().exec();
  }

  // NEW: for a given user, returns one row per person they've chatted
  // with — the other user's id, their most recent message + timestamp,
  // and how many unread messages that user has sent.
  async getConversations(userId: string) {
    const conversations = await this.chatModel.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      {
        $addFields: {
          otherUser: {
            $cond: [{ $eq: ['$sender', userId] }, '$recipient', '$sender'],
          },
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$otherUser',
          lastMessage: { $first: '$message' },
          lastMessageAt: { $first: '$createdAt' },
          lastMessageSender: { $first: '$sender' },
        },
      },
    ]);

    const unreadCounts = await this.chatModel.aggregate([
      { $match: { recipient: userId, read: { $ne: true } } },
      { $group: { _id: '$sender', count: { $sum: 1 } } },
    ]);
    const unreadMap = new Map(unreadCounts.map((u) => [u._id, u.count]));

    return conversations.map((c) => ({
      userId: c._id,
      lastMessage: c.lastMessage,
      lastMessageAt: c.lastMessageAt,
      lastMessageSender: c.lastMessageSender,
      unreadCount: unreadMap.get(c._id) || 0,
    }));
  }

  // NEW: marks every message otherUserId sent to userId as read.
  // Call this when userId opens that conversation.
  async markAsRead(userId: string, otherUserId: string) {
    return this.chatModel.updateMany(
      { sender: otherUserId, recipient: userId, read: { $ne: true } },
      { $set: { read: true } },
    );
  }
}