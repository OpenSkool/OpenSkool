import { User } from '@prisma/client';

import { prisma } from '~/prisma';

export interface UserModel extends User {}

const DELETED_USER: UserModel = {
  id: '__DELETED_USER__',
  name: 'Deleted User',
};

export async function getAllUsers(): Promise<UserModel[]> {
  return prisma.user.findMany();
}

export async function findUserById(id: string | null): Promise<UserModel> {
  if (id == null) {
    return DELETED_USER;
  }
  const user = await prisma.user.findUnique({ where: { id } });
  return user ?? DELETED_USER;
}
