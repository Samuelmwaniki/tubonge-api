import { IsNotEmpty, IsString } from "class-validator";
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

}