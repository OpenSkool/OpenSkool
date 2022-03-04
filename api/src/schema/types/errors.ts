import { list, nonNull, objectType } from 'nexus';

export enum UserErrorCode {
  VALUE_INVALID = 'valueInvalid',
}

export const UserError = objectType({
  name: 'UserError',
  definition(t) {
    t.nonNull.string('code');
    t.nonNull.string('message');
    t.nonNull.field('path', {
      type: list(nonNull('String')),
    });
  },
});
