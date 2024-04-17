import { Resolver, Subscription, Args, Mutation, Query } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';

import { ChatsService } from './chats.service';
import { Chat } from './entities/chat.entity';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { TokenPayload } from '../auth/token-payload.interface';
import { PaginationArgs } from 'src/common/dto/pagination-args.dto';
import { PubSub } from 'graphql-subscriptions';
import { Int } from '@nestjs/graphql';

@Resolver(() => Chat)
export class ChatsResolver {
  constructor(
    private readonly chatsService: ChatsService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Chat)
  async createChat(
    @Args('createChatInput') createChatInput: CreateChatInput,
    @CurrentUser() user: TokenPayload,
  ): Promise<Chat> {
    const chat = await this.chatsService.create(createChatInput, user._id);
    this.pubSub.publish('CHAT_CREATED', { chatCreated: chat });
    return chat;
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Chat], { name: 'chats' })
  async findAll(@Args() paginationArgs: PaginationArgs): Promise<Chat[]> {
    return this.chatsService.findMany([], paginationArgs);
  }

  @Query(() => Chat, { name: 'chat' })
  async findOne(@Args('_id') _id: string): Promise<Chat> {
    return this.chatsService.findOne(_id);
  }

  @Mutation(() => Chat)
  updateChat(@Args('updateChatInput') updateChatInput: UpdateChatInput) {
    return this.chatsService.update(updateChatInput.id, updateChatInput);
  }

  @Mutation(() => Chat)
  removeChat(@Args('id', { type: () => Int }) id: number) {
    return this.chatsService.remove(id);
  }

  @Subscription(() => Chat, {
    name: 'chatCreated',
    filter: (payload, variables, context) => {
      return payload.chatCreated.userId === context.req.user._id;
    },
  })
  chatCreated() {
    return this.pubSub.asyncIterator('CHAT_CREATED');
  }
}
