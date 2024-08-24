import { handleError } from '@app/common';
import { Injectable } from '@nestjs/common';
import { CreateAutobotDto } from '../dto/create-autobot.dto';
import { UpdateAutobotDto } from '../dto/update-autobot.dto';
import { Autobot } from '@prisma/client';
import { AutobotRepository } from '../repositories/autobot.repository';
import { AutobotGateway } from '../autobot.gateway';
import { CommentService } from 'src/comment/comment.service';
import { PostService } from 'src/post/post.service';
import axios from 'axios';

@Injectable()
export class AutobotService {
  constructor(
    protected readonly autobotRepository: AutobotRepository,
    private readonly autobotGateway: AutobotGateway,
    protected readonly commentService: CommentService,
    protected readonly postService: PostService,
  ) {}

  async find(query: any): Promise<Autobot> {
    try {
      return await this.autobotRepository.find({
        where: query,
        // include: { posts: true},
      });
    } catch (error) {
      handleError(error);
    }
  }

  async findAll(query: any): Promise<Autobot[]> {
    try {
      return await this.autobotRepository.findMany(query);
    } catch (error) {
      handleError(error);
    }
  }
  async remove(id: string): Promise<Autobot> {
    try {
      return await this.autobotRepository.delete({
        where: { id },
      });
    } catch (error) {
      handleError(error);
    }
  }
  async generateAutobots() {
    let autobotsCount;
    for (let i = 0; i < 500; i++) {
      // Fetch user data
      const { data: user } = await axios.get(
        `https://jsonplaceholder.typicode.com/users/${i}`,
      );

      // Create a new Autobot using Prisma
      const autobot = await this.autobotRepository.create({
        data: {
          name: user.name,
        },
      });

      // Create 10 posts for each Autobot
      for (let j = 0; j < 10; j++) {
        const { data: post } = await axios.get(
          `https://jsonplaceholder.typicode.com/posts/${j}`,
        );

        // Create a new Post associated with the Autobot
        const newPost = await this.postService.create({
          title: `${post.title}-${i}-${j}`,
          body: post.body,
          authorId: autobot.id,
        });

        // Create 10 comments for each post
        for (let k = 0; k < 10; k++) {
          const { data: comment } = await axios.get(
            `https://jsonplaceholder.typicode.com/comments/${k}`,
          );

          // Create a new Comment associated with the Post
          await this.commentService.create({
            title: comment.name,
            comment: comment.body,
            postId: newPost.id,
            authorId: comment.name,
            parentId: '',
          });
        }
      }

      const newCount = await this.autobotRepository.count({});

      // Emit the new count to all connected clients
      autobotsCount = await this.autobotGateway.updateAutobotCount(newCount);
    }
    return autobotsCount;
  }

  async update(id: string, updateAutobotData: UpdateAutobotDto) {
    try {
      return await this.autobotRepository.update({
        where: { id },
        data: updateAutobotData,
      });
    } catch (error) {
      handleError(error);
    }
  }

  async upsert(id: string, updateAutobotData: UpdateAutobotDto) {
    try {
      return await this.autobotRepository.upsert({
        where: { id },
        data: updateAutobotData,
      });
    } catch (error) {
      handleError(error);
    }
  }
}
