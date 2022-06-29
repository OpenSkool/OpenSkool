import SchemaBuilder from '@pothos/core';
import ErrorsPlugin from '@pothos/plugin-errors';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import type { JsonObject } from 'type-fest';

import { prisma } from '~/prisma';

import { Context } from './context';

const builder = new SchemaBuilder<{
  Context: Context;
  DefaultInputFieldRequiredness: true;
  PrismaTypes: PrismaTypes;
  Scalars: {
    ID: { Input: string; Output: string };
    DateTime: { Input: Date; Output: Date };
    JSON: { Input: JsonObject; Output: JsonObject };
  };
}>({
  defaultInputFieldRequiredness: true,
  plugins: [ErrorsPlugin, PrismaPlugin],
  prisma: {
    client: prisma,
  },
});

builder.mutationType({});
builder.queryType({});

export default builder;
