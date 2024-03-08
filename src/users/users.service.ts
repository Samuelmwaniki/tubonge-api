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
    const existingUser = await this.userModel.findOne({ 'username': username }).exec();
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    const newUser = new this.userModel({ username,firstname,lastname, password });
    return await newUser.save();
  }

  async login(username: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ 'username':username }).exec();

    const testPass = await bcrypt.hash(password, await bcrypt.genSalt());
    // console.log('PASSED PASS : ', password, await bcrypt.compare(password, testPass))
    // console.log('ADDED PASS : ', user.password)

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: user.username, sub: user._id };
    const token = this.jwtService.sign(payload);

    return { user, token }
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
