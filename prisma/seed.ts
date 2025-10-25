import { PrismaClient, Role } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Hash passwords
  const hashedPasswordAlice = await argon2.hash('password123');
  const hashedPasswordBob = await argon2.hash('password123');
  const hashedPasswordCharlie = await argon2.hash('password123');

  // Create users
  const alice = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      password: hashedPasswordAlice,
      role: Role.ADMIN,
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      password: hashedPasswordBob,
      role: Role.USER,
    },
  });

  const charlie = await prisma.user.create({
    data: {
      email: 'charlie@example.com',
      password: hashedPasswordCharlie,
      role: Role.USER,
    },
  });

  // Create projects
  const projectAlpha = await prisma.project.create({
    data: {
      name: 'Project Alpha',
      ownerId: alice.id,
    },
  });

  const projectBeta = await prisma.project.create({
    data: {
      name: 'Project Beta',
      ownerId: bob.id,
    },
  });

  // Create tasks
  await prisma.task.createMany({
    data: [
      {
        title: 'Setup database',
        description: 'Initialize the MySQL database and create tables',
        projectId: projectAlpha.id,
        assigneeId: bob.id,
        completed: false,
      },
      {
        title: 'Implement auth',
        description: 'Add JWT authentication',
        projectId: projectAlpha.id,
        assigneeId: charlie.id,
        completed: false,
      },
      {
        title: 'Design homepage',
        description: 'Create UI mockups for the homepage',
        projectId: projectBeta.id,
        assigneeId: bob.id,
        completed: true,
      },
      {
        title: 'Write API documentation',
        description: 'Document all endpoints with Swagger',
        projectId: projectBeta.id,
        assigneeId: null,
        completed: false,
      },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
