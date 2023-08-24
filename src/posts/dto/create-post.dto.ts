import { Optional } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';

export class postDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  text: string;

  @Optional()
  image: string;
}
