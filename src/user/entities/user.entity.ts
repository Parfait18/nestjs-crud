import { Role } from '@prisma/client';

export class User {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  role: Role;
  createdAt: Date;
  // updated: string;
  // posts: Post[];
}
