import SchemaBuilder from '@pothos/core';
import ErrorsPlugin from '@pothos/plugin-errors';

import { Context } from './context';

const builder = new SchemaBuilder<{
  Context: Context;
  DefaultInputFieldRequiredness: true;
  Scalars: {
    ID: { Input: string; Output: string };
    DateTime: { Input: Date; Output: Date };
  };
}>({
  defaultInputFieldRequiredness: true,
  plugins: [ErrorsPlugin],
});

builder.mutationType({});
builder.queryType({});

export default builder;
