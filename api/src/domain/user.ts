import type UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import { Language } from '@prisma/client';
import { z } from 'zod';

import type { KeycloakAdminExecute } from '~/api/keycloak';
import { AppCradle } from '~/plugins/awilix';

const zUserModel = z.object({
  id: z.string(),
});

export type UserModel = UserRepresentation & z.infer<typeof zUserModel>;

export const DELETED_USER: UserModel = {
  id: '__DELETED_USER__',
  firstName: 'Deleted',
  lastName: 'User',
  username: 'deleted-user',
};

export class UserService {
  kcAdminExecute: KeycloakAdminExecute;

  language: Language;

  constructor(inject: AppCradle) {
    this.kcAdminExecute = inject.keycloakAdminExecute;
    this.language = inject.language;
  }

  async findUserById(id: string | null): Promise<UserModel> {
    if (id == null) {
      return DELETED_USER;
    }
    const user = await this.kcAdminExecute((client) =>
      client.users.findOne({ id }),
    );
    return user == null ? DELETED_USER : assertUserModel(user);
  }
}

function assertUserModel(userRepresentation: UserRepresentation): UserModel {
  const user = zUserModel.parse(userRepresentation);
  return { ...userRepresentation, ...user };
}
