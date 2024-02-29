import { IsNotEmpty, IsString, MinLength } from 'class-validator';


export class VerifyUserDto {
@IsNotEmpty()
  @IsString()
  verificationcode: string;
}