import { Body, Controller, Get, Headers, Param, Post, Req, Res } from '@nestjs/common';
import type { Response } from 'express';
import { GeminiService } from './gemini.service';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) { }

  @Post('stream')
  async streamMessage(@Body() body: { message: string, projectId: string }) {
    return this.geminiService.workspaceGemini(body.message, body.projectId);
  }

  @Get('/:id')
  async getAllGeminiChats(@Param('id') id: string) {
    return this.geminiService.getGeminiChats(id);
  }

  @Get('/recommendation/:id')
  async recommendations(@Param('id') id: string) {
    return this.geminiService.getGeminiRecomendations(id);
  }

}
