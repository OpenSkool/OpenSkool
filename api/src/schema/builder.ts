import SchemaBuilder from '@pothos/core';
import ErrorsPlugin from '@pothos/plugin-errors';
import type { JsonObject } from 'type-fest';

import { Context } from './context';

const builder = new SchemaBuilder<{
  Context: Context;
  DefaultInputFieldRequiredness: true;
  Scalars: {
    ID: { Input: string; Output: string };
    DateTime: { Input: Date; Output: Date };
    JSON: { Input: JsonObject; Output: JsonObject };
  };
}>({
  defaultInputFieldRequiredness: true,
  plugins: [ErrorsPlugin],
});

builder.mutationType({});
builder.queryType({});

export default builder;
