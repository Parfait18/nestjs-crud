import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  //create first user
  const user1 = await prisma.user.upsert({
    where: { email: 'johndoe@gmail.com' },
    update: {},
    create: {
      email: 'johndoe@gmail.com',
      firstname: 'John',
      lastname: 'Doe',
      password: await hash('password', 10),
    },
  });
  const user2 = await prisma.user.upsert({
    where: { email: 'janedoe@gmail.com' },
    update: {},
    create: {
      email: 'janedoe@gmail.com',
      firstname: 'Jane',
      lastname: 'Doe',
      password: await hash('password', 10),
    },
  });

  const post1 = await prisma.post.upsert({
    where: { title: 'Security in web development' },
    update: {},
    create: {
      title: 'Security in web development',
      slug: 'security-in-web-development',
      description:
        'Ex voluptate ea ullamco sunt duis non quis reprehenderit aliquip veniam cillum nisi et. Laborum laborum nisi consectetur occaecat. Minim esse velit deserunt proident aute. Quis laborum officia pariatur ad ea dolor. Proident eiusmod mollit adipisicing dolor commodo irure adipisicing deserunt adipisicing. Ullamco ea irure laborum quis pariatur do reprehenderit nulla consequat magna duis nostrud dolor. Officia ex anim Lorem deserunt adipisicing sit enim id tempor ullamco ex qui occaecat.',
      userId: user1.id,
    },
  });

  const post2 = await prisma.post.upsert({
    where: { title: 'Security in mobile development' },
    update: {},
    create: {
      title: 'Security in mobile development',
      slug: 'security-in-mobile-development',
      description:
        'Ex voluptate ea ullamco sunt duis non quis reprehenderit aliquip veniam cillum nisi et. Laborum laborum nisi consectetur occaecat. Minim esse velit deserunt proident aute. Quis laborum officia pariatur ad ea dolor. Proident eiusmod mollit adipisicing dolor commodo irure adipisicing deserunt adipisicing. Ullamco ea irure laborum quis pariatur do reprehenderit nulla consequat magna duis nostrud dolor. Officia ex anim Lorem deserunt adipisicing sit enim id tempor ullamco ex qui occaecat.',
      userId: user1.id,
    },
  });
  console.log({ user1, user2, post1, post2 });
}
main()
  .then(async () => {
    console.log('Database seed run successfully');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
