import { Module } from '@nestjs/common';
import { AutobotService } from './services/autobot.service';
import { AutobotController } from './autobot.controller';
import { AutobotGateway } from './autobot.gateway';
import { PostService } from 'src/post/post.service';
import { CommentService } from 'src/comment/comment.service';

@Module({
  providers: [AutobotService, AutobotGateway, PostService, CommentService],
  controllers: [AutobotController],
})
export class AutobotModule {}
