import { PrismaClient } from '@prisma/client';

import { seedCompetencies } from './seed/competency';
import { seedCourses } from './seed/course';
import { seedEducations } from './seed/education';
import { seedInternships } from './seed/internship';
import { seedOrganisations } from './seed/organisation';

const prisma = new PrismaClient();

try {
  if ((await prisma.user.count()) === 0) {
    throw new Error(
      'No users found. Start the App and log in to create your first user.',
    );
  }
  await seedCompetencies(prisma);
  await seedCourses(prisma);
  await seedEducations(prisma);
  await seedInternships(prisma);
  await seedOrganisations(prisma);
} catch (error) {
  console.error(error);
} finally {
  prisma.$disconnect();
}
