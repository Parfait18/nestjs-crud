import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRepository } from './post.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(private readonly postRepostiory: PostRepository) {}

  create(createPostDto: CreatePostDto) {
    return this.postRepostiory.create(createPostDto);
  }

  findAll() {
    return this.postRepostiory.findAll();
  }

  findOne(id: number) {
    return this.postRepostiory.findById(id);
  }

  find(options: Prisma.PostFindFirstArgs) {
    return this.postRepostiory.find(options);
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return this.postRepostiory.updatePost(id, updatePostDto);
  }

  remove(id: number) {
    return this.postRepostiory.deletePost(id);
  }
}
