import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, minlength: 2, maxlength: 50 })
  firstname: string;

  @Prop({ required: true, minlength: 2, maxlength: 50 })
  lastname: string;

  @Prop({ required: true, unique: true, trim: true })
  username: string;

  @Prop({ required: true, minlength: 6 })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Pre-save hook to hash the password before saving to the database
UserSchema.pre<UserDocument>('save', async function (next) {
  if (this.isModified('password')) {
    try {
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
    } catch (error) {
      return next(error);
    }
  }
  next();
});
