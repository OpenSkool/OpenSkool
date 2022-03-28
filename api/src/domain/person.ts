import { Person } from '@prisma/client';

import { prisma } from '../prisma';

export async function getAllPeople(): Promise<Person[]> {
  return prisma.person.findMany();
}

export async function findPersonById(id: string): Promise<Person | null> {
  return prisma.person.findUnique({
    where: { id },
  });
}
