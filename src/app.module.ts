import { Module } from '@nestjs/common';
import { AutobotModule } from './autobot/autobot.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { PrismaModule } from '@app/prisma';

@Module({
  imports: [
    AutobotModule,
    ThrottlerModule.forRoot([{ ttl: 60, limit: 5 }]),
    PostModule,
    CommentModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
