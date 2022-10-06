import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	documents: ['src/**/*.{ts,vue}'],
	// emitLegacyCommonJSImports: false,
	generates: {
		'src/codegen/': {
			config: { useTypeImports: true },
			preset: 'client',
			plugins: [],
		},
	},
	hooks: {
		afterAllFileWrite: ['prettier --write'],
	},
	schema: '../api/src/codegen/schema.graphql',
};

export default config;
