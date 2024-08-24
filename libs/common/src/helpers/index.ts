import { HttpException, HttpStatus } from '@nestjs/common';

export const handleError = (error: any) => {
  throw new HttpException(error.message ? error.message : error, error.code);
};
