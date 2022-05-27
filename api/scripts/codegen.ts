import fs from 'node:fs';

import { printSchema } from 'graphql';
import prettier from 'prettier';

import schema from '../src/schema';

fs.writeFileSync(
  new URL('../src/codegen/schema.graphql', import.meta.url),
  prettier.format(printSchema(schema), { parser: 'graphql' }),
);
