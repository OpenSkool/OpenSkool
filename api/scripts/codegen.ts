import fs from 'node:fs';
import path from 'node:path';

import { printSchema } from 'graphql';
import prettier from 'prettier';

import schema from '../src/schema';

fs.writeFileSync(
  path.join(__dirname, '../src/codegen/schema.graphql'),
  prettier.format(printSchema(schema), { parser: 'graphql' }),
);
