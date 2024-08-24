import { PartialType } from '@nestjs/mapped-types';
import { Post } from '@prisma/client';

// export class UpdatePostDto extends PartialType(CreatePostDto) {}
export class UpdatePostDto extends PartialType(Post) {}
