// users.controller.ts
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.model';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body('username') username: string, @Body('password') password: string): Promise<any> {
    const user = await this.usersService.register(username, password);
    return { message: 'User registered successfully', user };
  }

  @Post('login')
  async login(@Body('username') username: string, @Body('password') password: string): Promise<any> {
    const token = await this.usersService.login(username, password);
    return { token };
  }

  @Get(':userId')
  async getUserProfile(@Param('userId') userId: string): Promise<User | null> {
    return this.usersService.getUserProfile(userId);
  }

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }
}
