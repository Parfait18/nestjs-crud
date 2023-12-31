import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(user: Prisma.UserCreateArgs) {
    return this.prismaService.user.create(user);
  }

  async findAll() {
    return this.prismaService.user.findMany({ include: { posts: {} } });
  }
  async findById(id: number) {
    return this.prismaService.user.findUnique({
      where: { id },
      include: { posts: {} },
    });
  }

  async findByEmail(options: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.findUnique({ where: options });
  }

  async updateUser(id: number, user: Prisma.UserUpdateInput) {
    return this.prismaService.user.update({ where: { id }, data: { ...user } });
  }

  async deleteUser(id: number) {
    return this.prismaService.user.delete({ where: { id } });
  }
}
