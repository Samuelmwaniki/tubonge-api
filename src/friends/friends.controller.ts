import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  // GET /friends?userId=<id>  -> accepted friends list
  @Get('')
  async getFriends(@Query('userId') userId: string) {
    return this.friendsService.getFriends(userId);
  }

  // GET /friends/requests?userId=<id>  -> pending requests sent TO you
  @Get('requests')
  async getPendingRequests(@Query('userId') userId: string) {
    return this.friendsService.getPendingRequests(userId);
  }

  // GET /friends/sent?userId=<id>  -> pending requests YOU sent (for "Manage Invites")
  @Get('sent')
  async getSentRequests(@Query('userId') userId: string) {
    return this.friendsService.getSentRequests(userId);
  }

  // POST /friends/invite  { fromUserId, username }
  @Post('invite')
  async invite(@Body() body: { fromUserId: string; username: string }) {
    return this.friendsService.invite(body.fromUserId, body.username);
  }

  // POST /friends/respond  { requestId, userId, accept }
  @Post('respond')
  async respond(@Body() body: { requestId: string; userId: string; accept: boolean }) {
    return this.friendsService.respond(body.requestId, body.userId, body.accept);
  }

  // DELETE /friends/requests/:requestId?userId=<id>  -> cancel a sent invite
  @Delete('requests/:requestId')
  async cancel(@Param('requestId') requestId: string, @Query('userId') userId: string) {
    return this.friendsService.cancelRequest(requestId, userId);
  }

  // DELETE /friends/:friendId?userId=<id>  -> remove an existing friend
  @Delete(':friendId')
  async unfriend(@Param('friendId') friendId: string, @Query('userId') userId: string) {
    return this.friendsService.unfriend(userId, friendId);
  }
}