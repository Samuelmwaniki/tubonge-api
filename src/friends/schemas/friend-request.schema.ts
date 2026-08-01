import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FriendRequestDocument = FriendRequest & Document;

@Schema()
export class FriendRequest {
  @Prop({ required: true })
  fromUserId: string;

  @Prop({ required: true })
  toUserId: string;

  @Prop({ default: 'pending', enum: ['pending', 'accepted', 'rejected'] })
  status: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const FriendRequestSchema = SchemaFactory.createForClass(FriendRequest);