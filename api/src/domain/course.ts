import type { Course } from '@prisma/client';

import { handleServiceError } from '~/domain/helpers';
import { AppNotFoundError } from '~/errors';
import { prisma } from '~/prisma';

export interface CourseModel extends Course {}

export async function getCourseById(id: string): Promise<CourseModel> {
  try {
    const course = await prisma.course.findUnique({
      where: { id },
    });
    if (course == null) {
      throw new AppNotFoundError();
    }
    return course;
  } catch (error) {
    handleServiceError(error);
  }
}
