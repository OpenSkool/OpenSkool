import { interfaceType, list, nonNull, objectType } from 'nexus';

export interface BaseErrorModel {
  code: string;
  message: string;
  path: string[];
}

export const BaseError = interfaceType({
  name: 'BaseError',
  definition(t) {
    t.nonNull.string('code');
    t.nonNull.string('message');
    t.field('path', {
      type: list(nonNull('String')),
    });
  },
  resolveType(data) {
    throw new Error('Errors should include their typeName in the resolver');
  },
});

export const InputError = objectType({
  name: 'InputError',
  definition(t) {
    t.implements('BaseError');
  },
  sourceType: {
    export: 'BaseErrorModel',
    module: __filename,
  },
});
