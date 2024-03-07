import { Prop,Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Transform } from 'class-transformer';
export type ChatDocument = Chat & Document;

@Schema()
export class Chat {
  @Prop()
  sender: string;
    
  @Prop()
  recipient: string;

  // @Prop()
  // timestamp: Date;
    @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ required: true })
  message: string;
 


  
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
