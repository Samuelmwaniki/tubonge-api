import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class loginUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;
  
  @IsNotEmpty()
  @IsString()
  @MinLength(6) // Example: Minimum length of 6 characters for password
  password: string;
 @Prop({ default: false })
  login: boolean;
  
}