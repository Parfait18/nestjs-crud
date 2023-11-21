import { Post } from '@prisma/client';

export class User {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  createdAt: string;
  updated: string;
  posts: Post[];
}
