import { list, nonNull, objectType } from 'nexus';

export interface UserErrorModel {
  code: string;
  message: string;
  path: string[];
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
  sourceType: {
    export: 'UserErrorModel',
    module: __filename,
  },
});
