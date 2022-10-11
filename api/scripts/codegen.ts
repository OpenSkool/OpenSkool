import fs from 'node:fs/promises';

import { printSchema } from 'graphql';
import prettier from 'prettier';

import schema from '~/schema';

await fs.mkdir(new URL('../src/codegen', import.meta.url), { recursive: true });
await fs.writeFile(
	new URL('../src/codegen/schema.graphql', import.meta.url),
	prettier.format(printSchema(schema), { parser: 'graphql' }),
);
