// create-user.dto.ts
import { IsNotEmpty, IsString, MinLength,IsBoolean, MaxLength ,} from 'class-validator';
import { Prop } from '@nestjs/mongoose';

export class CreateUserDto {
  @IsNotEmpty({message:"username is required"})
  @IsString()
  @MinLength(4)
  @MaxLength(50)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6) // Example: Minimum length of 6 characters for password
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
   @MaxLength(50)
  firstname: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
   @MaxLength(50)
  lastname: string;
  
  
 

  

  

  
 
  
}
