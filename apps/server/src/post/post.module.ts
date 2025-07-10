import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { GeminiModule } from 'src/gemini/gemini.module';

@Module({
  imports: [GeminiModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
