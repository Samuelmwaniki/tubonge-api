import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import {
  FriendRequest,
  FriendRequestSchema,
} from './schemas/friend-request.schema';
import { User, UserSchema } from '../users/user.model';
// ASSUMPTION: adjust this import to match whatever module/path your
// ChatModule actually uses to make WebsocketsGateway injectable.
import { WebsocketsModule } from '../gateway/websockets/websockets.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FriendRequest.name, schema: FriendRequestSchema },
      { name: User.name, schema: UserSchema },
    ]),
    WebsocketsModule,
  ],
  controllers: [FriendsController],
  providers: [FriendsService],
})
export class FriendsModule {}
