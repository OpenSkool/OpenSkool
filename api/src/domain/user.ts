import { User } from '@prisma/client';

import { prisma } from '../prisma';

export async function getAllUsers(): Promise<User[]> {
  return prisma.user.findMany();
}

export async function findUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id },
  });
}
