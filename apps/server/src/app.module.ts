import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { SocketModule } from './socket/socket.module';
import { EventModule } from './event/event.module';
import { ProjectModule } from './project/project.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { PostModule } from './post/post.module';
import { ProfileModule } from './profile/profile.module';
import { GeminiModule } from './gemini/gemini.module';

@Module({
  imports: [AuthModule, ChatModule, SocketModule, EventModule, ProjectModule, WorkspaceModule, PostModule, ProfileModule, GeminiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
