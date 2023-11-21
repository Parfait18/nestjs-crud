import { IsNotEmpty, IsNumber, IsString } from '@nestjs/class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  userId: number;
}

//   @IsString()
//   @IsNotEmpty()
//   slug: string;
