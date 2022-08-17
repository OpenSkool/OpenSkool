import type UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import type { UserQuery } from '@keycloak/keycloak-admin-client/lib/resources/users';
import type { SetRequired } from 'type-fest';
import { z } from 'zod';

import type { KeycloakAdminExecute } from '~/api/keycloak';
import type { AppCradle } from '~/plugins/awilix';

enum RequiredActionAlias {
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
  username: 'Deleted User',
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

  async get(id: string | null): Promise<UserModel> {
    if (id == null) {
      return DELETED_USER;
    }
    const representation = await this.kcAdminExecute((client) =>
      client.users.findOne({ id }),
    );
    return representation == null ? DELETED_USER : mapUserModel(representation);
  }

  async getMany(ids: string[]): Promise<UserModel[]> {
    const representations = await Promise.all(ids.map((id) => this.get(id)));
    return representations.map(mapUserModel);
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
      return this.get(newUserId);
    }
    return existingUser;
  }
}

function mapUserModel(representation: UserRepresentation): UserModel {
  const user = zUserModel.parse(representation);
  return { ...representation, ...user };
}
