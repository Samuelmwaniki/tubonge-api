// chat.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../users/user.model';

export type ChatDocument = Chat & Document;

@Schema()
export class Chat {
  @Prop({ type: User }) // Assuming User is your existing user schema
  sender: User;

  @Prop({ type: User })
  recipient: User;

  @Prop({ required: true })
  message: string;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
