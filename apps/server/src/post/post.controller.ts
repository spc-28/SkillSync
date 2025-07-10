import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { GeminiService } from 'src/gemini/gemini.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService, private readonly geminiService: GeminiService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    const { tags } = await this.geminiService.getTags(createPostDto.content); 
    console.log(tags)
    return this.postService.create(createPostDto, tags);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Patch(':id')
  addLike(@Param('id') id: string) {
    return this.postService.addLike(id);
  }

  @Post('/image')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: 
  //@ts-ignore
  Express.Multer.File) {
    const imageUrl = await this.postService.uploadFile(file);
    return { imageUrl };
  }

}
