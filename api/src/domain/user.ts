import { User } from '@prisma/client';

import { prisma } from '../prisma';

export interface UserModel extends User {}

export async function getAllUsers(): Promise<UserModel[]> {
  return prisma.user.findMany();
}

export async function findUserById(id: string): Promise<UserModel | null> {
  return prisma.user.findUnique({
    where: { id },
  });
}
