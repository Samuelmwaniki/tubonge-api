import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.model';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(username: string, password: string,firstname: string,lastname:string): Promise<User> {
    const existingUser = await this.userModel.findOne({ 'username': username,'firstname':firstname,'lastname':lastname }).exec();
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ username,firstname,lastname, password: hashedPassword });
    return await newUser.save();
  }

  async login(username: string, password: string): Promise<string> {
    const user = await this.userModel.findOne({ 'username':username }).exec();
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: user.username, sub: user._id };
    return this.jwtService.sign(payload);
  }

  async getUserProfile(userId: string): Promise<User | null> {
    return this.userModel.findById(userId).exec();
  }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async validateUser(username: string, password: string,firstname:string,lastname:string): Promise<User | null> {
    const user = await this.userModel.findOne({ username,firstname,lastname }).exec();
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }
}
