import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';

export class chatDto {
  @IsNotEmpty()
  @IsString()
  receipient: string;

  @IsNotEmpty()
  @IsString()
  sender : string;

  @IsNotEmpty()
  @IsString()
  message: string;

//   @IsNotEmpty()
//   @IsString()
//   created_at:Date;
//   deleted_at:Date;
  
  
  
}