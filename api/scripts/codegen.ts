import assert from 'node:assert';
import fs from 'node:fs/promises';

import { printSchema } from 'graphql';
import prettier from 'prettier';

import schema from '~/schema';

const configFile = await prettier.resolveConfigFile();
assert(configFile);
const config = JSON.parse(
	await fs.readFile(configFile, 'utf8'),
) as prettier.Options;

await fs.mkdir(new URL('../src/codegen', import.meta.url), { recursive: true });
await fs.writeFile(
	new URL('../src/codegen/schema.graphql', import.meta.url),
	prettier.format(printSchema(schema), { ...config, parser: 'graphql' }),
);
