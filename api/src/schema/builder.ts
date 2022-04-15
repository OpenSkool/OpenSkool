import SchemaBuilder from '@pothos/core';

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

  // plugins may add options that can  be provided here
});

builder.mutationType({});
builder.queryType({});

export default builder;
