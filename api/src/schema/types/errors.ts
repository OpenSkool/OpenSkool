import builder from '../builder';

interface BaseErrorModel {
  code: string;
  message: string;
  path?: string[];
}

export const BaseError = builder.interfaceRef<BaseErrorModel>('BaseError');

builder.interfaceType(BaseError, {
  name: 'BaseError',
  fields: (t) => ({
    code: t.exposeString('code'),
    message: t.exposeString('message'),
    path: t.exposeStringList('path', { nullable: true }),
  }),
});

export const InputError = builder.objectRef<BaseErrorModel>('InputError');

builder.objectType(InputError, {
  name: 'InputError',
  interfaces: [BaseError],
});
