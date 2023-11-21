import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { stringToSlug } from 'src/utils/slug.service';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(post: CreatePostDto) {
    return this.prismaService.post.create({
      data: {
        ...post,
        slug: stringToSlug(post.title),
      },
    });
  }

  async findAll() {
    return this.prismaService.post.findMany({ include: { user: {} } });
  }

  async findById(id: number) {
    return this.prismaService.post.findFirstOrThrow({
      where: { id },
      include: { user: {} },
    });
  }

  async find(options: Prisma.PostFindFirstArgs) {
    return this.prismaService.post.findFirst({
      ...options,
      include: { user: {} },
    });
  }

  async updatePost(id: number, post: Prisma.PostUpdateInput) {
    return this.prismaService.user.update({
      where: { id },
      data: { ...post },
    });
  }

  async deletePost(id: number) {
    return this.prismaService.user.delete({ where: { id } });
  }
}
