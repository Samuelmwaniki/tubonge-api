// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.model';
// import { ChatService } from 'src/chat/chat.service';
// import {Chat} from '../chat/dto/chat.model'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    // private chatService:ChatService
  ) {}

  async login(username: string, password: string): Promise<string> {
    return this.usersService.login(username, password);
  }

// async Chat (sender:string,receipient:string,message:string,created_at:string,deleted_at:string): promise <any>{
//   return this.chatService.sendChat(sender,receipient,message,created_at,deleted_at);
// }


  async register(firstname: string, lastname:string, username: string, password: string): Promise<User> {
    return this.usersService.register(firstname,lastname,username,password);
  }
}
