import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'yourSecretKey', // Replace with your own secret key
    });
  }

  async validate(payload: any): Promise<User> {
    if (!payload.username || !payload.password) {
      throw new UnauthorizedException('Invalid payload');
    }
    const {firstname,lastname, username, password } = payload;
    const user = await this.usersService.validateUser(firstname,lastname,username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
