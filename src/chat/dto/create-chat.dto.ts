import { IsNotEmpty, IsString } from "class-validator";
import { Transform } from 'class-transformer';
import { Prop } from "@nestjs/mongoose";
export class CreateChatDto {
  @IsNotEmpty({ message: "message cannot be empty" })

  @IsString({ message: "invalid" })

  message: string;

  @IsNotEmpty({ message: "please select a receipient" })

  @IsString({ message: "invalid" })

  recipient: string;
   @IsNotEmpty({ message: "login to send" })

  @IsString({ message: "invalid" })

  sender: string;
  @IsNotEmpty()
  createdAt: Date;
 
}