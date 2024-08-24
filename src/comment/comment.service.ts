import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Comment, CommentStatus } from '@prisma/client';
import { handleError } from '@app/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentRepository } from './comment.repository';

@Injectable()
export class CommentService {
  constructor(protected readonly commentRepository: CommentRepository) {}

  async find(query: any): Promise<Comment> {
    try {
      return await this.commentRepository.find({
        where: query,
        include: { profile: true, roles: true, refreshTokens: true },
      });
    } catch (error) {
      handleError(error);
    }
  }

  async findAll(query: any): Promise<Comment[]> {
    try {
      return await this.commentRepository.findMany(query);
    } catch (error) {
      handleError(error);
    }
  }
  async remove(id: string): Promise<Comment> {
    try {
      return await this.commentRepository.delete({
        where: { id },
      });
    } catch (error) {
      handleError(error);
    }
  }
  async create(createCommentData: CreateCommentDto): Promise<Comment> {
    const { commentId } = createCommentData;

    try {
      const existingComment = await this.commentRepository.exists({
        where: { commentId },
      });

      if (existingComment) {
        throw new HttpException(
          'Comment with credentials already exists.',
          HttpStatus.CONFLICT,
        );
      }

      const commentData = {
        title: '',
        body: '',
        description: '',
        tags: '',
        image: '',
        status: CommentStatus.ACTIVE,
      };

      const newComment = await this.commentRepository.create({
        data: commentData,
      });
      Logger.debug(newComment);
      return newComment;
    } catch (error) {
      Logger.log(error);
      handleError(error);
    }
  }

  async update(updateCommentData: UpdateCommentDto) {
    const { id, ...data } = updateCommentData;

    try {
      return await this.commentRepository.update({
        where: { id },
        data,
      });
    } catch (error) {
      handleError(error);
    }
  }

  async upsert(updateCommentData: UpdateCommentDto) {
    Logger.debug(updateCommentData);

    try {
      return await this.commentRepository.upsert({
        where: { id: updateCommentData.id },
        data: updateCommentData.data,
      });
    } catch (error) {
      handleError(error);
    }
  }
}
