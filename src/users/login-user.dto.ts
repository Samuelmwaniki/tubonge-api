import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class loginUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;
  
  @IsNotEmpty()
  @IsString()
  @MinLength(5) 
  password: string;

  
}