import { graphql } from '~/codegen';

export const UserErrorFragment = graphql(`
	fragment UserErrorFragment on UserError {
		code
		message
		path
	}
`);
