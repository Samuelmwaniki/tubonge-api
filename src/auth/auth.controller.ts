// src/auth/auth.controller.ts

import { Controller, Post,Res,Req, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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



  @Post('register')
  async register(@Body() credentials: { firstname: string, lastname:string,username: string; password: string }): Promise<any> {
    const {firstname,lastname, username, password } = credentials;
    const user = await this.authService.register(firstname,lastname,username, password);
    return { message: 'User registered successfully', user };
  }
}
