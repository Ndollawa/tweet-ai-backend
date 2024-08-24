import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PostDto } from './post.dto';

export class CreateAutobotDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PostDto)
  @IsOptional()
  posts?: PostDto[];
}

export class UpdateAutobotDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PostDto)
  @IsOptional()
  posts?: PostDto[];
}
