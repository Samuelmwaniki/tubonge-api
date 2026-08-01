import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FriendRequest, FriendRequestDocument } from './schemas/friend-request.schema';
import { User, UserDocument } from '../users/user.model';
import { WebsocketsGateway } from 'src/gateway/websockets/websockets.gateway';

@Injectable()
export class FriendsService {
  constructor(
    @InjectModel(FriendRequest.name) private friendRequestModel: Model<FriendRequestDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly gateway: WebsocketsGateway,
  ) {}

  // Sends a friend request from fromUserId to whoever owns `username`.
  async invite(fromUserId: string, username: string) {
    const toUser = await this.userModel.findOne({ username }).exec();
    if (!toUser) {
      throw new NotFoundException(`No user found with username "${username}"`);
    }

    const toUserId = String(toUser._id);

    if (toUserId === fromUserId) {
      throw new BadRequestException('You cannot add yourself as a friend.');
    }

    const existing = await this.friendRequestModel
      .findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
        status: { $in: ['pending', 'accepted'] },
      })
      .exec();

    if (existing) {
      if (existing.status === 'accepted') {
        throw new BadRequestException('You are already friends with this user.');
      }
      throw new BadRequestException('A friend request is already pending with this user.');
    }

    const request = await this.friendRequestModel.create({
      fromUserId,
      toUserId,
      status: 'pending',
    });

    // Let the invited user know in real time.
    this.gateway.emitToUser(toUserId, 'friendRequest', {
      requestId: request._id,
      fromUserId,
    });

    return request;
  }

  // Accept or decline a request that was sent TO userId.
  async respond(requestId: string, userId: string, accept: boolean) {
    const request = await this.friendRequestModel.findById(requestId).exec();

    if (!request) {
      throw new NotFoundException('Friend request not found.');
    }
    if (request.toUserId !== userId) {
      throw new BadRequestException('This request was not sent to you.');
    }
    if (request.status !== 'pending') {
      throw new BadRequestException('This request has already been responded to.');
    }

    request.status = accept ? 'accepted' : 'rejected';
    await request.save();

    if (accept) {
      // Let the original sender know their invite was accepted.
      this.gateway.emitToUser(request.fromUserId, 'friendRequestAccepted', {
        userId: request.toUserId,
      });
    }

    return request;
  }

  // Accepted friends only — this is what powers the sidebar list.
  async getFriends(userId: string) {
    const accepted = await this.friendRequestModel
      .find({
        status: 'accepted',
        $or: [{ fromUserId: userId }, { toUserId: userId }],
      })
      .exec();

    const friendIds = accepted.map((r) =>
      r.fromUserId === userId ? r.toUserId : r.fromUserId,
    );

    if (friendIds.length === 0) {
      return [];
    }

    return this.userModel
      .find({ _id: { $in: friendIds } }, { firstname: 1, lastname: 1, username: 1 })
      .exec();
  }

  // Pending requests sent TO userId, with the sender's username attached.
  async getPendingRequests(userId: string) {
    const requests = await this.friendRequestModel
      .find({ toUserId: userId, status: 'pending' })
      .sort({ createdAt: -1 })
      .exec();

    const fromUserIds = requests.map((r) => r.fromUserId);
    const users = await this.userModel
      .find({ _id: { $in: fromUserIds } }, { username: 1 })
      .exec();
    const usernameById = new Map(users.map((u) => [String(u._id), u.username]));

    return requests.map((r) => ({
      requestId: r._id,
      fromUserId: r.fromUserId,
      fromUsername: usernameById.get(r.fromUserId) || 'Unknown user',
      createdAt: r.createdAt,
    }));
  }

  // Requests userId has SENT that are still pending — powers "Manage Invites".
  async getSentRequests(userId: string) {
    const requests = await this.friendRequestModel
      .find({ fromUserId: userId, status: 'pending' })
      .sort({ createdAt: -1 })
      .exec();

    const toUserIds = requests.map((r) => r.toUserId);
    const users = await this.userModel
      .find({ _id: { $in: toUserIds } }, { username: 1 })
      .exec();
    const usernameById = new Map(users.map((u) => [String(u._id), u.username]));

    return requests.map((r) => ({
      requestId: r._id,
      toUserId: r.toUserId,
      toUsername: usernameById.get(r.toUserId) || 'Unknown user',
      createdAt: r.createdAt,
    }));
  }

  // Lets a user cancel a request they sent before it's been accepted/declined.
  async cancelRequest(requestId: string, userId: string) {
    const request = await this.friendRequestModel.findById(requestId).exec();
    if (!request) {
      throw new NotFoundException('Friend request not found.');
    }
    if (request.fromUserId !== userId) {
      throw new BadRequestException('You did not send this request.');
    }
    await this.friendRequestModel.deleteOne({ _id: requestId }).exec();
    return { cancelled: true };
  }

  // NEW: removes an existing (accepted) friendship in either direction,
  // and notifies the other user in real time so their sidebar updates
  // without needing a refresh.
  async unfriend(userId: string, friendId: string) {
    const result = await this.friendRequestModel
      .deleteOne({
        status: 'accepted',
        $or: [
          { fromUserId: userId, toUserId: friendId },
          { fromUserId: friendId, toUserId: userId },
        ],
      })
      .exec();

    if (result.deletedCount > 0) {
      this.gateway.emitToUser(friendId, 'friendRemoved', { userId });
    }

    return { unfriended: result.deletedCount > 0 };
  }
}