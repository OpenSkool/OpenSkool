import { Internship, InternshipInstance } from '@prisma/client';

import { DomainContext } from '~/domain/context';
import { CourseModel } from '~/domain/course';
import { handleServiceError } from '~/domain/helpers';
import { AppNotFoundError } from '~/errors';
import { prisma } from '~/prisma';

export interface InternshipModel extends Internship {}

export interface InternshipInstanceModel extends InternshipInstance {}

export async function getInternshipInstancesForUser(
  context: DomainContext,
): Promise<InternshipInstanceModel[]> {
  try {
    const internshipInstances = await prisma.internshipInstance.findMany({
      where: { studentId: context.userId },
    });
    return internshipInstances;
  } catch (error) {
    handleServiceError(error);
  }
}

export async function getInternshipById(id: string): Promise<InternshipModel> {
  try {
    const internship = await prisma.internship.findUnique({
      where: { id },
    });
    if (internship == null) {
      throw new AppNotFoundError();
    }
    return internship;
  } catch (error) {
    handleServiceError(error);
  }
}

export async function getInternshipCourses(id: string): Promise<CourseModel[]> {
  try {
    const internship = await prisma.internship.findUnique({
      where: { id },
      select: { courses: true },
    });
    if (internship == null) {
      throw new AppNotFoundError();
    }
    return internship.courses;
  } catch (error) {
    handleServiceError(error);
  }
}
