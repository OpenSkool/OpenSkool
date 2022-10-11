import { graphql } from 'msw';

import type {
	DeleteCompetencyMutation,
	DeleteCompetencyMutationVariables,
	ManageEditCompetencyQuery,
	ManageCompetencyDetailRouteQuery,
	ManageNestedCompetenciesQuery,
	MutationCreateCompetencyFrameworkArgs,
	MutationCreateNestedCompetencyArgs,
	MutationCreateRootCompetencyArgs,
	MutationRenameCompetencyArgs,
	RenameCompetencyMutation,
	CreateCompetencyFrameworkMutation,
	CreateRootCompetencyMutation,
	CreateNestedCompetencyMutation,
} from '~/codegen/graphql';

export default [
	// mutations

	graphql.mutation<
		CreateNestedCompetencyMutation,
		MutationCreateNestedCompetencyArgs
	>('CreateNestedCompetency', (req, res, ctx) => {
		return res(
			ctx.data({
				createNestedCompetency: {
					__typename: 'MutationCreateNestedCompetencySuccess',
					data: { id: 'a-new-uuid' },
				},
			}),
		);
	}),

	graphql.mutation<
		CreateRootCompetencyMutation,
		MutationCreateRootCompetencyArgs
	>('CreateRootCompetency', (req, res, ctx) => {
		return res(
			ctx.data({
				createRootCompetency: {
					__typename: 'MutationCreateRootCompetencySuccess',
					data: { framework: { competencies: [] } },
				},
			}),
		);
	}),

	graphql.mutation<
		CreateCompetencyFrameworkMutation,
		MutationCreateCompetencyFrameworkArgs
	>('CreateCompetencyFramework', (req, res, ctx) => {
		return res(
			ctx.data({
				createCompetencyFramework: {
					__typename: 'MutationCreateCompetencyFrameworkSuccess',
					data: { id: 'a-new-cuid' },
				},
			}),
		);
	}),

	graphql.mutation<DeleteCompetencyMutation, DeleteCompetencyMutationVariables>(
		'deleteCompetency',
		(req, res, ctx) => {
			return res(
				ctx.data({
					deleteCompetency: {
						__typename: 'MutationDeleteCompetencySuccess',
						data: { id: req.variables.id },
					},
				}),
			);
		},
	),

	graphql.mutation<RenameCompetencyMutation, MutationRenameCompetencyArgs>(
		'renameCompetency',
		(req, res, ctx) => {
			return res(
				ctx.data({
					renameCompetency: {
						__typename: 'MutationRenameCompetencySuccess',
						data: { id: req.variables.id },
					},
				}),
			);
		},
	),

	// queries

	graphql.query('getEducations', (req, res, ctx) => {
		return res(
			ctx.data({
				allEducations: [
					{ __typename: 'Education', id: 'chemistry', title: 'Chemistry' },
					{ __typename: 'Education', id: 'informatics', title: 'Informatics' },
					{ __typename: 'Education', id: 'medicine', title: 'Medicine' },
				],
			}),
		);
	}),

	graphql.query<ManageEditCompetencyQuery>(
		'manageEditCompetency',
		(req, res, ctx) => {
			return res(
				ctx.data({
					__typename: 'Query',
					competency: {
						__typename: 'QueryCompetencySuccess',
						data: {
							title: 'Title defined in handlers.ts',
						},
					},
				}),
			);
		},
	),

	graphql.query<ManageNestedCompetenciesQuery>(
		'manageNestedCompetencies',
		(req, res, ctx) => {
			return res(
				ctx.data({
					__typename: 'Query',
					competency: {
						__typename: 'QueryCompetencySuccess',
						data: {
							subCompetencies: [
								{
									id: 'cuid',
									title: 'custom title',
								},
							],
						},
					},
				}),
			);
		},
	),

	graphql.query<ManageCompetencyDetailRouteQuery>(
		'manageCompetencyDetailRoute',
		(req, res, ctx) => {
			return res(
				ctx.data({
					__typename: 'Query',
					competency: {
						__typename: 'QueryCompetencySuccess',
						data: {
							parent: {
								title: 'custom title',
								id: 'cuid',
							},
							title: 'custom title',
						},
					},
					competencyFramework: {
						__typename: 'QueryCompetencyFrameworkSuccess',
						data: {
							title: 'Competency Framework Title',
						},
					},
				}),
			);
		},
	),
];
