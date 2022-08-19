import type { PrismaClient } from '@prisma/client';

const COURSE_NAMES = [
  'Chemistry',
  'Economics',
  'Electricity',
  'Fashion',
  'Informatics',
  'Math',
  'Mechanics',
  'Photography',
];

export async function seedCourses(prisma: PrismaClient): Promise<void> {
  for (const name of COURSE_NAMES) {
    const existingCourse = await prisma.course.findFirst({
      where: { name: { equals: name } },
    });
    if (existingCourse == null) {
      await prisma.course.create({ data: { name } });
    }
  }
}
