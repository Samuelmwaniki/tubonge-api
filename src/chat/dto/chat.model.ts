import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type ChatDocument = Chat & Document;

@Schema()
export class Chat {
  @Prop({ required: true })
 sender: string;

  @Prop({ required: true})
  receipient: string;

  @Prop({ required: true })
  message: string;

//    @Prop({ required: true })
//   created_at: string;

//   @Prop({ required: true, })
//   deleted_at:string;

}


export const ChatSchema = SchemaFactory.createForClass(Chat);
