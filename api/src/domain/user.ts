import type UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import type { UserQuery } from '@keycloak/keycloak-admin-client/lib/resources/users';
import type { SetRequired } from 'type-fest';
import { z } from 'zod';

import type { KeycloakAdminExecute } from '~/api/keycloak';
import type { AppCradle } from '~/plugins/awilix';

declare enum RequiredActionAlias {
  VERIFY_EMAIL = 'VERIFY_EMAIL',
  UPDATE_PROFILE = 'UPDATE_PROFILE',
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
}

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
  private kcAdminExecute: KeycloakAdminExecute;

  constructor(inject: AppCradle) {
    this.kcAdminExecute = inject.keycloakAdminExecute;
  }

  async create(
    data: SetRequired<UserRepresentation, 'email'>,
  ): Promise<string> {
    const { id } = await this.kcAdminExecute((client) =>
      client.users.create({
        enabled: true,
        username: data.email,
        ...data,
      }),
    );
    return id;
  }

  async findById(id: string | null): Promise<UserModel> {
    if (id == null) {
      return DELETED_USER;
    }
    const user = await this.kcAdminExecute((client) =>
      client.users.findOne({ id }),
    );
    return user == null ? DELETED_USER : mapUserModel(user);
  }

  async findOne(query: UserQuery): Promise<UserModel | null> {
    const [user] = await this.kcAdminExecute((client) =>
      client.users.find(query),
    );
    return user == null ? null : mapUserModel(user);
  }

  async invite(
    data: SetRequired<UserRepresentation, 'email'>,
  ): Promise<string> {
    const id = await this.create(data);
    await this.kcAdminExecute((client) =>
      client.users.executeActionsEmail({
        id,
        actions: [
          RequiredActionAlias.UPDATE_PASSWORD,
          RequiredActionAlias.UPDATE_PROFILE,
          RequiredActionAlias.VERIFY_EMAIL,
        ],
      }),
    );
    return id;
  }

  async inviteOrFind(email: string): Promise<UserModel> {
    const existingUser = await this.findOne({ email });
    if (existingUser == null) {
      const newUserId = await this.invite({ email });
      return this.findById(newUserId);
    }
    return existingUser;
  }
}

function mapUserModel(userRepresentation: UserRepresentation): UserModel {
  const user = zUserModel.parse(userRepresentation);
  return { ...userRepresentation, ...user };
}
