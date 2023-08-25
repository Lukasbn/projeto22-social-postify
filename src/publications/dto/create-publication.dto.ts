import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class publicationDto {
  @IsNumber()
  @IsNotEmpty()
  mediaId: number;
  @IsNumber()
  @IsNotEmpty()
  postId: number;
  @Transform(({ value }) => new Date(value))
  @IsDate()
  date: Date;
}
