import { Internship, InternshipInstance } from '@prisma/client';

import { handleServiceError } from '~/domain/helpers';
import { AppNotFoundError } from '~/errors';
import { prisma } from '~/prisma';

export interface InternshipModel extends Internship {}

export interface InternshipInstanceModel extends InternshipInstance {}

export async function getInternshipInstancesForUser(
  studentId: string | null,
): Promise<InternshipInstanceModel[] | null> {
  try {
    const internshipInstances = await prisma.internshipInstance.findMany({
      where: { studentId },
    });
    if (internshipInstances.length === 0) {
      throw new AppNotFoundError();
    }
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
