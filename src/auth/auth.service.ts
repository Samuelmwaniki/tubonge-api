// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.model';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string): Promise<string> {
    return this.usersService.login(username, password);
  }



  async register(firstname: string, lastname:string, username: string, password: string): Promise<User> {
    return this.usersService.register(firstname,lastname,username,password);
  }
}
