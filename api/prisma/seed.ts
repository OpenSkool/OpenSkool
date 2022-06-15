import {
  CompetencyFramework,
  Internship,
  PrismaClient,
  User,
} from '@prisma/client';

import { sample, sampleMany } from '~/utils';

import {
  CompetencyFixture,
  competencyFixtures,
  COURSE_NAMES,
  EDUCATION_TITLES,
} from './fixtures';

const INTERNSHIP_INSTANCE_COUNT = 3;

const prisma = new PrismaClient();

async function createCompetency(
  framework: CompetencyFramework,
  fixture: CompetencyFixture,
  user: User,
  nesting?: { root: string; parent: string },
): Promise<void> {
  const competency = await prisma.competency.create({
    data: {
      createdById: user.id,
      frameworkId: framework.id,
      updatedById: user.id,
      parentCompetencyId: nesting?.parent,
      translations: { create: { languageCode: 'EN', title: fixture.title } },
    },
  });
  if (Array.isArray(fixture.children)) {
    await createCompetencies(framework, fixture.children, user, {
      parent: competency.id,
      root: nesting?.root ?? competency.id,
    });
  }
}

async function createCourse(name: string): Promise<void> {
  const existingCourse = await prisma.course.findFirst({
    where: { name: { equals: name } },
  });
  if (existingCourse != null) {
    return;
  }
  await prisma.course.create({ data: { name } });
}

async function createCompetencies(
  framework: CompetencyFramework,
  fixtures: CompetencyFixture[],
  user: User,
  nesting?: { root: string; parent: string },
): Promise<void> {
  for (const fixture of fixtures) {
    await createCompetency(framework, fixture, user, nesting);
  }
}

async function createCompetencyFramework(user: User): Promise<void> {
  const title = 'CanMEDS 2015';
  const existingFramework = await prisma.competencyFramework.findFirst({
    where: { translations: { some: { title: { equals: title } } } },
  });
  if (existingFramework != null) {
    return;
  }
  const framework = await prisma.competencyFramework.create({
    data: {
      createdById: user.id,
      updatedById: user.id,
      translations: { create: { languageCode: 'EN', title: 'CanMEDS 2015' } },
    },
  });
  await createCompetencies(framework, competencyFixtures, user);
}

async function createEducation(title: string, user: User): Promise<void> {
  const existingEducation = await prisma.education.findFirst({
    where: { translations: { some: { title: { equals: title } } } },
  });
  if (existingEducation != null) {
    return;
  }
  await prisma.education.create({
    data: {
      createdById: user.id,
      updatedById: user.id,
      translations: { create: { languageCode: 'EN', title } },
    },
  });
}

async function createInternships(): Promise<Set<Internship>> {
  const courses = await prisma.course.findMany();
  const internships = new Set<Internship>();
  for (const course of courses) {
    const existingInternship = await prisma.internship.findFirst({
      where: { courses: { some: { id: { equals: course.id } } } },
    });
    if (existingInternship == null) {
      internships.add(
        await prisma.internship.create({
          data: { courses: { connect: [{ id: course.id }] } },
        }),
      );
    } else {
      internships.add(existingInternship);
    }
  }
  return internships;
}

async function createInternshipInstance(
  internships: Set<Internship>,
  user: User,
): Promise<void> {
  const existingInternships = await prisma.internshipInstance.findMany({
    where: { studentId: { equals: user.id } },
  });
  const internshipsPool = Array.from(internships).filter(
    (internship) =>
      !existingInternships.some(
        (existingInternship) => existingInternship.id === internship.id,
      ),
  );
  const someInternships = sampleMany(
    Math.max(0, INTERNSHIP_INSTANCE_COUNT - existingInternships.length),
    internshipsPool,
  );
  for (const internship of someInternships) {
    await prisma.internshipInstance.create({
      data: {
        internshipId: internship.id,
        studentId: user.id,
      },
    });
  }
}

try {
  const users = await prisma.user.findMany();
  if (users.length === 0) {
    throw new Error('No users found');
  }

  const competenciesUser = sample(users);
  await createCompetencyFramework(competenciesUser);

  for (const courseName of COURSE_NAMES) {
    createCourse(courseName);
  }

  for (const educationTitle of EDUCATION_TITLES) {
    createEducation(educationTitle, sample(users));
  }

  const internships = await createInternships();
  for (const user of users) {
    await createInternshipInstance(internships, user);
  }
} catch (error) {
  console.error(error);
} finally {
  prisma.$disconnect();
}
