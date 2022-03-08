import { prisma } from '../prisma';
import { Person } from '../schema/source-types';

export async function getAllPeople(): Promise<Person[]> {
  return prisma.person.findMany();
}

export async function findPersonById(id: string): Promise<Person | null> {
  return prisma.person.findUnique({
    where: { id },
  });
}
