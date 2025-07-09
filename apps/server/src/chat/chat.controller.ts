import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  @Get('/users')
  findAllUsers() {
    return this.chatService.findAllUsers();
  }

  @Get(':id')
  findAllChats(@Param('id') id: string) {
    return this.chatService.findAllChats(id);
  }

  @Get('/user/:id')
  getUser(@Param('id') id: string) {
    return this.chatService.getUser(id);
  }

}
