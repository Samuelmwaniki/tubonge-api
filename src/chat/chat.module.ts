// chat.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './schemas/chat.schema';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
// import { WebsocketsGateway } from 'src/gateway/websockets/websockets.gateway';
import { WebsocketsModule } from 'src/gateway/websockets/websockets.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]), WebsocketsModule],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
