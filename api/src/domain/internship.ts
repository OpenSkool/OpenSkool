import {
  Internship,
  InternshipInstance,
  InternshipPosition,
} from '@prisma/client';

import { DomainContext } from '~/domain/context';
import { handleServiceError } from '~/domain/helpers';
import { AppNotFoundError, AppUnauthorizedError } from '~/errors';
import { prisma } from '~/prisma';

export interface InternshipModel extends Internship {}

export interface InternshipInstanceModel extends InternshipInstance {}

export interface InternshipPositionModel extends InternshipPosition {}

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

export async function getInternshipInstanceById(
  id: string,
  context: DomainContext,
): Promise<InternshipInstanceModel> {
  try {
    const internshipInstance = await prisma.internshipInstance.findUnique({
      where: { id },
    });
    if (internshipInstance == null) {
      throw new AppNotFoundError();
    }
    if (internshipInstance.studentId !== context.userId) {
      throw new AppUnauthorizedError();
    }
    return internshipInstance;
  } catch (error) {
    handleServiceError(error);
  }
}

export async function getAvailablePositions(
  id: string,
): Promise<InternshipPositionModel[]> {
  try {
    const internship = await prisma.internship.findUnique({
      where: { id },
      include: { availablePositions: true },
    });
    if (internship == null) {
      throw new AppNotFoundError();
    }
    return internship.availablePositions as InternshipPositionModel[];
  } catch (error) {
    handleServiceError(error);
  }
}
