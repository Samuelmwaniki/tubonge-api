// src/auth/auth.controller.ts

import { Controller, Post,Res,Req, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/users/user.model';
import { ChatService } from 'src/chat/chat.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,private readonly chatService: ChatService) {}

  @Post('login')
  async login(@Body() credentials: { username: string; password: string }): Promise<any> {
    const { username, password } = credentials;
    const token = await this.authService.login(username, password);
    return { token };
  }
   @Post('logout')
  async logout(@Req() req: Request) {
    // You can perform any additional cleanup operations here
    return { message: 'Logged out successfully' };
  }


  // @Post()
  // async sendChat(@Body() chatDto: { sender: User, recipient: User, message: string,created_at:Date,deleted_at:Date }): Promise<any> {
  //   const { sender, recipient, message,created_at,deleted_at } = chatDto;
  //   return this.chatService.sendChat(sender, recipient, message,created_at,deleted_at);
  // }

  @Post('register')
  async register(@Body() credentials: { firstname: string, lastname:string,username: string; password: string }): Promise<any> {
    const {firstname,lastname, username, password } = credentials;
    const user = await this.authService.register(firstname,lastname,username, password);
    return { message: 'User registered successfully', user };
  }
}
