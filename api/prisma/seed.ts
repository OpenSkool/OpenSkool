import { PrismaClient } from '@prisma/client';

import { seedCompetencies } from './seed/competency';
import { seedCourses } from './seed/course';
import { seedEducations } from './seed/education';
import { seedInternships } from './seed/internship';
import { seedOrganisations } from './seed/organisation';

const prisma = new PrismaClient();

try {
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
