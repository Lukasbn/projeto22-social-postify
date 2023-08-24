import { IsNotEmpty, IsString } from 'class-validator';

export class mediaDto {
  @IsString()
  @IsNotEmpty({ message: 'All fields are required!' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'All fields are required!' })
  username: string;
}
