// src/auth/auth.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
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

  @Post('register')
  async register(@Body() credentials: { username: string; password: string }): Promise<any> {
    const { username, password } = credentials;
    const user = await this.authService.register(username, password);
    return { message: 'User registered successfully', user };
  }
}
