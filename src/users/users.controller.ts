import { Controller, Post, Body, Get, Param, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto'; // Import DTO for user creation
import { loginUserDto } from './login-user.dto';
import { userInfo } from 'os';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body(new ValidationPipe()) createUserDto: CreateUserDto): Promise<any> {
    const user = await this.usersService.register(createUserDto.username, createUserDto.password, createUserDto.firstname, createUserDto.lastname);
    return { message: 'User registered successfully'
    , user };
  }
  

  @Post('login')
  async login(@Body(new ValidationPipe())loginUserDto:loginUserDto):Promise<any>{
    return await this.usersService.login(loginUserDto.username,loginUserDto.password);
  }
  
  
  //username: string, @Body('password') password: string): Promise<any> {
  //   const token = await this.usersService.login(username, password);
  //   return { token };
  // }

  @Get(':userId')
  async getUserProfile(@Param('userId') userId: string): Promise<User | null> {
    return this.usersService.getUserProfile(userId);
  }

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }
}
