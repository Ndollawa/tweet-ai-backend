import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Post, PostStatus } from '@prisma/client';
import { handleError } from '@app/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
  constructor(protected readonly postRepository: PostRepository) {}

  async find(query: any): Promise<Post> {
    try {
      return await this.postRepository.find({
        where: query,
        include: { autobot: true },
      });
    } catch (error) {
      handleError(error);
    }
  }

  async findAll(query: any): Promise<Post[]> {
    try {
      return await this.postRepository.findMany(query);
    } catch (error) {
      handleError(error);
    }
  }
  async remove(id: string): Promise<Post> {
    try {
      return await this.postRepository.delete({
        where: { id },
      });
    } catch (error) {
      handleError(error);
    }
  }
  async create(createPostData: CreatePostDto): Promise<Post> {
    const { userId } = createPostData;

    try {
      const existingPost = await this.postRepository.exists({
        where: { userId },
      });

      if (existingPost) {
        throw new HttpException(
          'Post with credentials already exists.',
          HttpStatus.CONFLICT,
        );
      }

      const postData = {
        title: '',
        body: '',
        description: '',
        tags: '',
        image: '',
        status: PostStatus.ACTIVE,
      };

      const newPost = await this.postRepository.create({
        data: postData,
      });
      Logger.debug(newPost);
      return newPost;
    } catch (error) {
      Logger.log(error);
      handleError(error);
    }
  }

  async update(updatePostData: UpdatePostDto) {
    const { id, ...data } = updatePostData;

    try {
      return await this.postRepository.update({
        where: { id },
        data,
      });
    } catch (error) {
      handleError(error);
    }
  }

  async upsert(updatePostData: UpdatePostDto) {
    Logger.debug(updatePostData);

    try {
      return await this.postRepository.upsert({
        where: { id: updatePostData.id },
        data: updatePostData.data,
      });
    } catch (error) {
      handleError(error);
    }
  }
}
