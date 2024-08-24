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
        include: { author: true},
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
    const autobots = [];
    for (let i = 0; i < 500; i++) {
      const { data: user } = await axios.get('https://jsonplaceholder.typicode.com/users/1');
      const autobot =  await this.autobotRepository.create({ name: user.name });

      for (let j = 0; j < 10; j++) {
        const { data: post } = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
        const newPost = await this.postService.create({ title: `${post.title}-${i}-${j}`, body:post.body, author:autobot.id });

        for (let k = 0; k < 10; k++) {
          const { data: comment } = await axios.get('https://jsonplaceholder.typicode.com/comments/1');
          const newComment = await this.commentService.create({ body: comment.body, post: newPost });
        }
      }
      autobots.push(autobot);
        // Your logic to increment the Autobot count
        const newCount = /* logic to calculate new count */;
        
        // Emit the new count to all clients
        this.autobotGateway.updateAutobotCount(newCount);
      
    }
    return autobots;
  }
  async update(id:string, updateAutobotData: UpdateAutobotDto) {
   
       try {
         return await this.autobotRepository.update({
           where: { id },
            data: updateAutobotData,
         });
       } catch (error) {
         handleError(error);
       }
     }
   
     async upsert(id:string, updateAutobotData: UpdateAutobotDto) {
   
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
