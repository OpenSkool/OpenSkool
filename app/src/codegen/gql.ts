/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
	'\n\tquery authCurrentUser {\n\t\tauth {\n\t\t\tabilityRules {\n\t\t\t\taction\n\t\t\t\tconditions\n\t\t\t\tfields\n\t\t\t\tinverted\n\t\t\t\treason\n\t\t\t\tsubject\n\t\t\t}\n\t\t\tcurrentUser {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\ttokenSet {\n\t\t\t\t\trefreshToken {\n\t\t\t\t\t\texpiresAt\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n':
		types.AuthCurrentUserDocument,
	'\n\tquery manageEditCompetency($id: ID!) {\n\t\tcompetency(id: $id) {\n\t\t\t... on QueryCompetencySuccess {\n\t\t\t\tdata {\n\t\t\t\t\ttitle\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t}\n':
		types.ManageEditCompetencyDocument,
	'\n\tmutation renameCompetency($id: ID!, $data: RenameCompetencyInput!) {\n\t\trenameCompetency(id: $id, data: $data) {\n\t\t\t... on MutationRenameCompetencySuccess {\n\t\t\t\tdata {\n\t\t\t\t\tid\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t}\n':
		types.RenameCompetencyDocument,
	'\n\tmutation swapCompetencies($leftCompetencyId: ID!, $rightCompetencyId: ID!) {\n\t\tswapCompetencies(\n\t\t\tleftCompetencyId: $leftCompetencyId\n\t\t\trightCompetencyId: $rightCompetencyId\n\t\t) {\n\t\t\t... on MutationSwapCompetenciesSuccess {\n\t\t\t\tdata {\n\t\t\t\t\tleft {\n\t\t\t\t\t\tid\n\t\t\t\t\t}\n\t\t\t\t\tright {\n\t\t\t\t\t\tid\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t}\n':
		types.SwapCompetenciesDocument,
	'\n\tmutation CreateCompetencyFramework($data: CreateCompetencyFrameworkInput!) {\n\t\tcreateCompetencyFramework(data: $data) {\n\t\t\t... on MutationCreateCompetencyFrameworkSuccess {\n\t\t\t\tdata {\n\t\t\t\t\tid\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t}\n':
		types.CreateCompetencyFrameworkDocument,
	'\n\tquery ManageCompetencyFrameworkList {\n\t\tallCompetencyFrameworks {\n\t\t\tid\n\t\t\ttitle\n\t\t}\n\t}\n':
		types.ManageCompetencyFrameworkListDocument,
	'\n\tmutation CreateNestedCompetency($data: CreateNestedCompetencyInput!) {\n\t\tcreateNestedCompetency(data: $data) {\n\t\t\t... on MutationCreateNestedCompetencySuccess {\n\t\t\t\tdata {\n\t\t\t\t\tid\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t}\n':
		types.CreateNestedCompetencyDocument,
	'\n\tquery manageNestedCompetencies($id: ID!) {\n\t\tcompetency(id: $id) {\n\t\t\t... on QueryCompetencySuccess {\n\t\t\t\tdata {\n\t\t\t\t\tsubCompetencies {\n\t\t\t\t\t\tid\n\t\t\t\t\t\ttitle\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t}\n':
		types.ManageNestedCompetenciesDocument,
	'\n\tmutation CreateRootCompetency($data: CreateRootCompetencyInput!) {\n\t\tcreateRootCompetency(data: $data) {\n\t\t\t... on MutationCreateRootCompetencySuccess {\n\t\t\t\tdata {\n\t\t\t\t\tframework {\n\t\t\t\t\t\tcompetencies {\n\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\ttitle\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t}\n':
		types.CreateRootCompetencyDocument,
	'\n\tquery manageRootCompetencies($id: ID!) {\n\t\tcompetencyFramework(id: $id) {\n\t\t\t... on QueryCompetencyFrameworkSuccess {\n\t\t\t\tdata {\n\t\t\t\t\tcompetencies {\n\t\t\t\t\t\tid\n\t\t\t\t\t\ttitle\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t}\n':
		types.ManageRootCompetenciesDocument,
	'\n\tquery MainMenu {\n\t\tmyInternshipInstances {\n\t\t\tid\n\t\t\tinternship {\n\t\t\t\tid\n\t\t\t\tcourse {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n':
		types.MainMenuDocument,
	'\n\tquery InternshipOverviewCurriculumQuery($id: ID!) {\n\t\tinternshipInstance(id: $id) {\n\t\t\tid\n\t\t\tinternship {\n\t\t\t\tid\n\t\t\t\tcoordinator {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t\tcourse {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t\teducation {\n\t\t\t\t\ttitle\n\t\t\t\t}\n\t\t\t}\n\t\t\tsupervisors {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t}\n\t}\n':
		types.InternshipOverviewCurriculumQueryDocument,
	'\n\tquery InternshipOverviewPositionQuery($id: ID!) {\n\t\tinternshipInstance(id: $id) {\n\t\t\tid\n\t\t\tassignedPosition {\n\t\t\t\torganisation {\n\t\t\t\t\timageUrl\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t\tsummary\n\t\t\t}\n\t\t}\n\t}\n':
		types.InternshipOverviewPositionQueryDocument,
	'\n\tmutation ApplyForInternshipMutation(\n\t\t$instanceId: ID!\n\t\t$positionId: ID!\n\t\t$priority: Int!\n\t) {\n\t\tapplyForPriorityInternshipPosition(\n\t\t\tinstanceId: $instanceId\n\t\t\tpositionId: $positionId\n\t\t\tpriority: $priority\n\t\t) {\n\t\t\tinstance {\n\t\t\t\tid\n\t\t\t\tappliedForPosition(id: $positionId)\n\t\t\t}\n\t\t}\n\t}\n':
		types.ApplyForInternshipMutationDocument,
	'\n\tmutation InviteInternshipPositionMentorMutation(\n\t\t$email: String!\n\t\t$positionId: ID!\n\t) {\n\t\tinviteInternshipPositionMentor(email: $email, positionId: $positionId) {\n\t\t\tid\n\t\t\tmentors {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t}\n\t}\n':
		types.InviteInternshipPositionMentorMutationDocument,
	'\n\tquery InternshipPositionListQuery($id: ID!) {\n\t\tinternshipInstance(id: $id) {\n\t\t\tinternship {\n\t\t\t\tcourse {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t\tavailablePositions {\n\t\t\t\t\tid\n\t\t\t\t\tsummary\n\t\t\t\t\torganisation {\n\t\t\t\t\t\timageUrl\n\t\t\t\t\t\tname\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n':
		types.InternshipPositionListQueryDocument,
	'\n\tfragment UserErrorFragment on UserError {\n\t\tcode\n\t\tmessage\n\t\tpath\n\t}\n':
		types.UserErrorFragmentFragmentDoc,
	'\n\tquery manageCompetencyCreateNestedCompetencyRoute(\n\t\t$competencyId: ID!\n\t\t$frameworkId: ID!\n\t) {\n\t\tcompetency(id: $competencyId) {\n\t\t\t... on QueryCompetencySuccess {\n\t\t\t\tdata {\n\t\t\t\t\ttitle\n\t\t\t\t\tframework {\n\t\t\t\t\t\ttitle\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t\tcompetencyFramework(id: $frameworkId) {\n\t\t\t... on QueryCompetencyFrameworkSuccess {\n\t\t\t\tdata {\n\t\t\t\t\ttitle\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t}\n':
		types.ManageCompetencyCreateNestedCompetencyRouteDocument,
	'\n\tquery manageCompetencyEditCompetencyRoute($id: ID!) {\n\t\tcompetency(id: $id) {\n\t\t\t... on QueryCompetencySuccess {\n\t\t\t\tdata {\n\t\t\t\t\ttitle\n\t\t\t\t\tframework {\n\t\t\t\t\t\ttitle\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t}\n':
		types.ManageCompetencyEditCompetencyRouteDocument,
	'\n\tquery manageCompetencyDetailRoute($competencyId: ID!, $frameworkId: ID!) {\n\t\tcompetency(id: $competencyId) {\n\t\t\t... on QueryCompetencySuccess {\n\t\t\t\tdata {\n\t\t\t\t\ttitle\n\t\t\t\t\tparent {\n\t\t\t\t\t\tid\n\t\t\t\t\t\ttitle\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t\tcompetencyFramework(id: $frameworkId) {\n\t\t\t... on QueryCompetencyFrameworkSuccess {\n\t\t\t\tdata {\n\t\t\t\t\ttitle\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n':
		types.ManageCompetencyDetailRouteDocument,
	'\n\tmutation deleteCompetency($id: ID!) {\n\t\tdeleteCompetency(id: $id) {\n\t\t\t... on MutationDeleteCompetencySuccess {\n\t\t\t\tdata {\n\t\t\t\t\tid\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t}\n':
		types.DeleteCompetencyDocument,
	'\n\tquery manageCompetencyCreateRootCompetencyRoute($id: ID!) {\n\t\tcompetencyFramework(id: $id) {\n\t\t\t... on QueryCompetencyFrameworkSuccess {\n\t\t\t\tdata {\n\t\t\t\t\ttitle\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t}\n':
		types.ManageCompetencyCreateRootCompetencyRouteDocument,
	'\n\tquery manageCompetencyFrameworkDetailRoute($id: ID!) {\n\t\tcompetencyFramework(id: $id) {\n\t\t\t... on QueryCompetencyFrameworkSuccess {\n\t\t\t\tdata {\n\t\t\t\t\tid\n\t\t\t\t\ttitle\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t}\n':
		types.ManageCompetencyFrameworkDetailRouteDocument,
	'\n\tquery MyInternshipRouteQuery($id: ID!) {\n\t\tinternshipInstance(id: $id) {\n\t\t\tid\n\t\t\tinternship {\n\t\t\t\tid\n\t\t\t\tcourse {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t\tisPositionAssigned\n\t\t}\n\t}\n':
		types.MyInternshipRouteQueryDocument,
	'\n\tquery InternshipInstancePositionDetailQuery(\n\t\t$instanceId: ID!\n\t\t$positionId: ID!\n\t) {\n\t\tinternshipInstance(id: $instanceId) {\n\t\t\tid\n\t\t\tappliedForPosition(id: $positionId)\n\t\t\tinternship {\n\t\t\t\tid\n\t\t\t\tcourse {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t\tdateFrom\n\t\t\t\tdateTo\n\t\t\t}\n\t\t}\n\t\tinternshipPosition(id: $positionId) {\n\t\t\tid\n\t\t\tmentors {\n\t\t\t\tid\n\t\t\t\tavatarUrl\n\t\t\t\tname\n\t\t\t}\n\t\t\torganisation {\n\t\t\t\timageUrl\n\t\t\t\tname\n\t\t\t}\n\t\t\tsummary\n\t\t\tworkplace {\n\t\t\t\tplainAddress\n\t\t\t}\n\t\t}\n\t}\n':
		types.InternshipInstancePositionDetailQueryDocument,
};

export function graphql(
	source: '\n\tquery authCurrentUser {\n\t\tauth {\n\t\t\tabilityRules {\n\t\t\t\taction\n\t\t\t\tconditions\n\t\t\t\tfields\n\t\t\t\tinverted\n\t\t\t\treason\n\t\t\t\tsubject\n\t\t\t}\n\t\t\tcurrentUser {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\ttokenSet {\n\t\t\t\t\trefreshToken {\n\t\t\t\t\t\texpiresAt\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n',
): typeof documents['\n\tquery authCurrentUser {\n\t\tauth {\n\t\t\tabilityRules {\n\t\t\t\taction\n\t\t\t\tconditions\n\t\t\t\tfields\n\t\t\t\tinverted\n\t\t\t\treason\n\t\t\t\tsubject\n\t\t\t}\n\t\t\tcurrentUser {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\ttokenSet {\n\t\t\t\t\trefreshToken {\n\t\t\t\t\t\texpiresAt\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n'];
export function graphql(
	source: '\n\tquery manageEditCompetency($id: ID!) {\n\t\tcompetency(id: $id) {\n\t\t\t... on QueryCompetencySuccess {\n\t\t\t\tdata {\n\t\t\t\t\ttitle\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t}\n',
): typeof documents['\n\tquery manageEditCompetency($id: ID!) {\n\t\tcompetency(id: $id) {\n\t\t\t... on QueryCompetencySuccess {\n\t\t\t\tdata {\n\t\t\t\t\ttitle\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t}\n'];
export function graphql(
	source: '\n\tmutation renameCompetency($id: ID!, $data: RenameCompetencyInput!) {\n\t\trenameCompetency(id: $id, data: $data) {\n\t\t\t... on MutationRenameCompetencySuccess {\n\t\t\t\tdata {\n\t\t\t\t\tid\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t}\n',
): typeof documents['\n\tmutation renameCompetency($id: ID!, $data: RenameCompetencyInput!) {\n\t\trenameCompetency(id: $id, data: $data) {\n\t\t\t... on MutationRenameCompetencySuccess {\n\t\t\t\tdata {\n\t\t\t\t\tid\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t}\n'];
export function graphql(
	source: '\n\tmutation swapCompetencies($leftCompetencyId: ID!, $rightCompetencyId: ID!) {\n\t\tswapCompetencies(\n\t\t\tleftCompetencyId: $leftCompetencyId\n\t\t\trightCompetencyId: $rightCompetencyId\n\t\t) {\n\t\t\t... on MutationSwapCompetenciesSuccess {\n\t\t\t\tdata {\n\t\t\t\t\tleft {\n\t\t\t\t\t\tid\n\t\t\t\t\t}\n\t\t\t\t\tright {\n\t\t\t\t\t\tid\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t}\n',
): typeof documents['\n\tmutation swapCompetencies($leftCompetencyId: ID!, $rightCompetencyId: ID!) {\n\t\tswapCompetencies(\n\t\t\tleftCompetencyId: $leftCompetencyId\n\t\t\trightCompetencyId: $rightCompetencyId\n\t\t) {\n\t\t\t... on MutationSwapCompetenciesSuccess {\n\t\t\t\tdata {\n\t\t\t\t\tleft {\n\t\t\t\t\t\tid\n\t\t\t\t\t}\n\t\t\t\t\tright {\n\t\t\t\t\t\tid\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t}\n'];
export function graphql(
	source: '\n\tmutation CreateCompetencyFramework($data: CreateCompetencyFrameworkInput!) {\n\t\tcreateCompetencyFramework(data: $data) {\n\t\t\t... on MutationCreateCompetencyFrameworkSuccess {\n\t\t\t\tdata {\n\t\t\t\t\tid\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t}\n',
): typeof documents['\n\tmutation CreateCompetencyFramework($data: CreateCompetencyFrameworkInput!) {\n\t\tcreateCompetencyFramework(data: $data) {\n\t\t\t... on MutationCreateCompetencyFrameworkSuccess {\n\t\t\t\tdata {\n\t\t\t\t\tid\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t}\n'];
export function graphql(
	source: '\n\tquery ManageCompetencyFrameworkList {\n\t\tallCompetencyFrameworks {\n\t\t\tid\n\t\t\ttitle\n\t\t}\n\t}\n',
): typeof documents['\n\tquery ManageCompetencyFrameworkList {\n\t\tallCompetencyFrameworks {\n\t\t\tid\n\t\t\ttitle\n\t\t}\n\t}\n'];
export function graphql(
	source: '\n\tmutation CreateNestedCompetency($data: CreateNestedCompetencyInput!) {\n\t\tcreateNestedCompetency(data: $data) {\n\t\t\t... on MutationCreateNestedCompetencySuccess {\n\t\t\t\tdata {\n\t\t\t\t\tid\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t}\n',
): typeof documents['\n\tmutation CreateNestedCompetency($data: CreateNestedCompetencyInput!) {\n\t\tcreateNestedCompetency(data: $data) {\n\t\t\t... on MutationCreateNestedCompetencySuccess {\n\t\t\t\tdata {\n\t\t\t\t\tid\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t}\n'];
export function graphql(
	source: '\n\tquery manageNestedCompetencies($id: ID!) {\n\t\tcompetency(id: $id) {\n\t\t\t... on QueryCompetencySuccess {\n\t\t\t\tdata {\n\t\t\t\t\tsubCompetencies {\n\t\t\t\t\t\tid\n\t\t\t\t\t\ttitle\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t}\n',
): typeof documents['\n\tquery manageNestedCompetencies($id: ID!) {\n\t\tcompetency(id: $id) {\n\t\t\t... on QueryCompetencySuccess {\n\t\t\t\tdata {\n\t\t\t\t\tsubCompetencies {\n\t\t\t\t\t\tid\n\t\t\t\t\t\ttitle\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t}\n'];
export function graphql(
	source: '\n\tmutation CreateRootCompetency($data: CreateRootCompetencyInput!) {\n\t\tcreateRootCompetency(data: $data) {\n\t\t\t... on MutationCreateRootCompetencySuccess {\n\t\t\t\tdata {\n\t\t\t\t\tframework {\n\t\t\t\t\t\tcompetencies {\n\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\ttitle\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t}\n',
): typeof documents['\n\tmutation CreateRootCompetency($data: CreateRootCompetencyInput!) {\n\t\tcreateRootCompetency(data: $data) {\n\t\t\t... on MutationCreateRootCompetencySuccess {\n\t\t\t\tdata {\n\t\t\t\t\tframework {\n\t\t\t\t\t\tcompetencies {\n\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\ttitle\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t}\n'];
export function graphql(
	source: '\n\tquery manageRootCompetencies($id: ID!) {\n\t\tcompetencyFramework(id: $id) {\n\t\t\t... on QueryCompetencyFrameworkSuccess {\n\t\t\t\tdata {\n\t\t\t\t\tcompetencies {\n\t\t\t\t\t\tid\n\t\t\t\t\t\ttitle\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t}\n',
): typeof documents['\n\tquery manageRootCompetencies($id: ID!) {\n\t\tcompetencyFramework(id: $id) {\n\t\t\t... on QueryCompetencyFrameworkSuccess {\n\t\t\t\tdata {\n\t\t\t\t\tcompetencies {\n\t\t\t\t\t\tid\n\t\t\t\t\t\ttitle\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t}\n'];
export function graphql(
	source: '\n\tquery MainMenu {\n\t\tmyInternshipInstances {\n\t\t\tid\n\t\t\tinternship {\n\t\t\t\tid\n\t\t\t\tcourse {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n',
): typeof documents['\n\tquery MainMenu {\n\t\tmyInternshipInstances {\n\t\t\tid\n\t\t\tinternship {\n\t\t\t\tid\n\t\t\t\tcourse {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n'];
export function graphql(
	source: '\n\tquery InternshipOverviewCurriculumQuery($id: ID!) {\n\t\tinternshipInstance(id: $id) {\n\t\t\tid\n\t\t\tinternship {\n\t\t\t\tid\n\t\t\t\tcoordinator {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t\tcourse {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t\teducation {\n\t\t\t\t\ttitle\n\t\t\t\t}\n\t\t\t}\n\t\t\tsupervisors {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t}\n\t}\n',
): typeof documents['\n\tquery InternshipOverviewCurriculumQuery($id: ID!) {\n\t\tinternshipInstance(id: $id) {\n\t\t\tid\n\t\t\tinternship {\n\t\t\t\tid\n\t\t\t\tcoordinator {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t\tcourse {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t\teducation {\n\t\t\t\t\ttitle\n\t\t\t\t}\n\t\t\t}\n\t\t\tsupervisors {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t}\n\t}\n'];
export function graphql(
	source: '\n\tquery InternshipOverviewPositionQuery($id: ID!) {\n\t\tinternshipInstance(id: $id) {\n\t\t\tid\n\t\t\tassignedPosition {\n\t\t\t\torganisation {\n\t\t\t\t\timageUrl\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t\tsummary\n\t\t\t}\n\t\t}\n\t}\n',
): typeof documents['\n\tquery InternshipOverviewPositionQuery($id: ID!) {\n\t\tinternshipInstance(id: $id) {\n\t\t\tid\n\t\t\tassignedPosition {\n\t\t\t\torganisation {\n\t\t\t\t\timageUrl\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t\tsummary\n\t\t\t}\n\t\t}\n\t}\n'];
export function graphql(
	source: '\n\tmutation ApplyForInternshipMutation(\n\t\t$instanceId: ID!\n\t\t$positionId: ID!\n\t\t$priority: Int!\n\t) {\n\t\tapplyForPriorityInternshipPosition(\n\t\t\tinstanceId: $instanceId\n\t\t\tpositionId: $positionId\n\t\t\tpriority: $priority\n\t\t) {\n\t\t\tinstance {\n\t\t\t\tid\n\t\t\t\tappliedForPosition(id: $positionId)\n\t\t\t}\n\t\t}\n\t}\n',
): typeof documents['\n\tmutation ApplyForInternshipMutation(\n\t\t$instanceId: ID!\n\t\t$positionId: ID!\n\t\t$priority: Int!\n\t) {\n\t\tapplyForPriorityInternshipPosition(\n\t\t\tinstanceId: $instanceId\n\t\t\tpositionId: $positionId\n\t\t\tpriority: $priority\n\t\t) {\n\t\t\tinstance {\n\t\t\t\tid\n\t\t\t\tappliedForPosition(id: $positionId)\n\t\t\t}\n\t\t}\n\t}\n'];
export function graphql(
	source: '\n\tmutation InviteInternshipPositionMentorMutation(\n\t\t$email: String!\n\t\t$positionId: ID!\n\t) {\n\t\tinviteInternshipPositionMentor(email: $email, positionId: $positionId) {\n\t\t\tid\n\t\t\tmentors {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t}\n\t}\n',
): typeof documents['\n\tmutation InviteInternshipPositionMentorMutation(\n\t\t$email: String!\n\t\t$positionId: ID!\n\t) {\n\t\tinviteInternshipPositionMentor(email: $email, positionId: $positionId) {\n\t\t\tid\n\t\t\tmentors {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t}\n\t}\n'];
export function graphql(
	source: '\n\tquery InternshipPositionListQuery($id: ID!) {\n\t\tinternshipInstance(id: $id) {\n\t\t\tinternship {\n\t\t\t\tcourse {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t\tavailablePositions {\n\t\t\t\t\tid\n\t\t\t\t\tsummary\n\t\t\t\t\torganisation {\n\t\t\t\t\t\timageUrl\n\t\t\t\t\t\tname\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n',
): typeof documents['\n\tquery InternshipPositionListQuery($id: ID!) {\n\t\tinternshipInstance(id: $id) {\n\t\t\tinternship {\n\t\t\t\tcourse {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t\tavailablePositions {\n\t\t\t\t\tid\n\t\t\t\t\tsummary\n\t\t\t\t\torganisation {\n\t\t\t\t\t\timageUrl\n\t\t\t\t\t\tname\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n'];
export function graphql(
	source: '\n\tfragment UserErrorFragment on UserError {\n\t\tcode\n\t\tmessage\n\t\tpath\n\t}\n',
): typeof documents['\n\tfragment UserErrorFragment on UserError {\n\t\tcode\n\t\tmessage\n\t\tpath\n\t}\n'];
export function graphql(
	source: '\n\tquery manageCompetencyCreateNestedCompetencyRoute(\n\t\t$competencyId: ID!\n\t\t$frameworkId: ID!\n\t) {\n\t\tcompetency(id: $competencyId) {\n\t\t\t... on QueryCompetencySuccess {\n\t\t\t\tdata {\n\t\t\t\t\ttitle\n\t\t\t\t\tframework {\n\t\t\t\t\t\ttitle\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t\tcompetencyFramework(id: $frameworkId) {\n\t\t\t... on QueryCompetencyFrameworkSuccess {\n\t\t\t\tdata {\n\t\t\t\t\ttitle\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t}\n',
): typeof documents['\n\tquery manageCompetencyCreateNestedCompetencyRoute(\n\t\t$competencyId: ID!\n\t\t$frameworkId: ID!\n\t) {\n\t\tcompetency(id: $competencyId) {\n\t\t\t... on QueryCompetencySuccess {\n\t\t\t\tdata {\n\t\t\t\t\ttitle\n\t\t\t\t\tframework {\n\t\t\t\t\t\ttitle\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t\tcompetencyFramework(id: $frameworkId) {\n\t\t\t... on QueryCompetencyFrameworkSuccess {\n\t\t\t\tdata {\n\t\t\t\t\ttitle\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t}\n'];
export function graphql(
	source: '\n\tquery manageCompetencyEditCompetencyRoute($id: ID!) {\n\t\tcompetency(id: $id) {\n\t\t\t... on QueryCompetencySuccess {\n\t\t\t\tdata {\n\t\t\t\t\ttitle\n\t\t\t\t\tframework {\n\t\t\t\t\t\ttitle\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t}\n',
): typeof documents['\n\tquery manageCompetencyEditCompetencyRoute($id: ID!) {\n\t\tcompetency(id: $id) {\n\t\t\t... on QueryCompetencySuccess {\n\t\t\t\tdata {\n\t\t\t\t\ttitle\n\t\t\t\t\tframework {\n\t\t\t\t\t\ttitle\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t}\n'];
export function graphql(
	source: '\n\tquery manageCompetencyDetailRoute($competencyId: ID!, $frameworkId: ID!) {\n\t\tcompetency(id: $competencyId) {\n\t\t\t... on QueryCompetencySuccess {\n\t\t\t\tdata {\n\t\t\t\t\ttitle\n\t\t\t\t\tparent {\n\t\t\t\t\t\tid\n\t\t\t\t\t\ttitle\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t\tcompetencyFramework(id: $frameworkId) {\n\t\t\t... on QueryCompetencyFrameworkSuccess {\n\t\t\t\tdata {\n\t\t\t\t\ttitle\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n',
): typeof documents['\n\tquery manageCompetencyDetailRoute($competencyId: ID!, $frameworkId: ID!) {\n\t\tcompetency(id: $competencyId) {\n\t\t\t... on QueryCompetencySuccess {\n\t\t\t\tdata {\n\t\t\t\t\ttitle\n\t\t\t\t\tparent {\n\t\t\t\t\t\tid\n\t\t\t\t\t\ttitle\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t\tcompetencyFramework(id: $frameworkId) {\n\t\t\t... on QueryCompetencyFrameworkSuccess {\n\t\t\t\tdata {\n\t\t\t\t\ttitle\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n'];
export function graphql(
	source: '\n\tmutation deleteCompetency($id: ID!) {\n\t\tdeleteCompetency(id: $id) {\n\t\t\t... on MutationDeleteCompetencySuccess {\n\t\t\t\tdata {\n\t\t\t\t\tid\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t}\n',
): typeof documents['\n\tmutation deleteCompetency($id: ID!) {\n\t\tdeleteCompetency(id: $id) {\n\t\t\t... on MutationDeleteCompetencySuccess {\n\t\t\t\tdata {\n\t\t\t\t\tid\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t}\n'];
export function graphql(
	source: '\n\tquery manageCompetencyCreateRootCompetencyRoute($id: ID!) {\n\t\tcompetencyFramework(id: $id) {\n\t\t\t... on QueryCompetencyFrameworkSuccess {\n\t\t\t\tdata {\n\t\t\t\t\ttitle\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t}\n',
): typeof documents['\n\tquery manageCompetencyCreateRootCompetencyRoute($id: ID!) {\n\t\tcompetencyFramework(id: $id) {\n\t\t\t... on QueryCompetencyFrameworkSuccess {\n\t\t\t\tdata {\n\t\t\t\t\ttitle\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t}\n'];
export function graphql(
	source: '\n\tquery manageCompetencyFrameworkDetailRoute($id: ID!) {\n\t\tcompetencyFramework(id: $id) {\n\t\t\t... on QueryCompetencyFrameworkSuccess {\n\t\t\t\tdata {\n\t\t\t\t\tid\n\t\t\t\t\ttitle\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t}\n',
): typeof documents['\n\tquery manageCompetencyFrameworkDetailRoute($id: ID!) {\n\t\tcompetencyFramework(id: $id) {\n\t\t\t... on QueryCompetencyFrameworkSuccess {\n\t\t\t\tdata {\n\t\t\t\t\tid\n\t\t\t\t\ttitle\n\t\t\t\t}\n\t\t\t}\n\t\t\t...UserErrorFragment\n\t\t}\n\t}\n'];
export function graphql(
	source: '\n\tquery MyInternshipRouteQuery($id: ID!) {\n\t\tinternshipInstance(id: $id) {\n\t\t\tid\n\t\t\tinternship {\n\t\t\t\tid\n\t\t\t\tcourse {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t\tisPositionAssigned\n\t\t}\n\t}\n',
): typeof documents['\n\tquery MyInternshipRouteQuery($id: ID!) {\n\t\tinternshipInstance(id: $id) {\n\t\t\tid\n\t\t\tinternship {\n\t\t\t\tid\n\t\t\t\tcourse {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t\tisPositionAssigned\n\t\t}\n\t}\n'];
export function graphql(
	source: '\n\tquery InternshipInstancePositionDetailQuery(\n\t\t$instanceId: ID!\n\t\t$positionId: ID!\n\t) {\n\t\tinternshipInstance(id: $instanceId) {\n\t\t\tid\n\t\t\tappliedForPosition(id: $positionId)\n\t\t\tinternship {\n\t\t\t\tid\n\t\t\t\tcourse {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t\tdateFrom\n\t\t\t\tdateTo\n\t\t\t}\n\t\t}\n\t\tinternshipPosition(id: $positionId) {\n\t\t\tid\n\t\t\tmentors {\n\t\t\t\tid\n\t\t\t\tavatarUrl\n\t\t\t\tname\n\t\t\t}\n\t\t\torganisation {\n\t\t\t\timageUrl\n\t\t\t\tname\n\t\t\t}\n\t\t\tsummary\n\t\t\tworkplace {\n\t\t\t\tplainAddress\n\t\t\t}\n\t\t}\n\t}\n',
): typeof documents['\n\tquery InternshipInstancePositionDetailQuery(\n\t\t$instanceId: ID!\n\t\t$positionId: ID!\n\t) {\n\t\tinternshipInstance(id: $instanceId) {\n\t\t\tid\n\t\t\tappliedForPosition(id: $positionId)\n\t\t\tinternship {\n\t\t\t\tid\n\t\t\t\tcourse {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t\tdateFrom\n\t\t\t\tdateTo\n\t\t\t}\n\t\t}\n\t\tinternshipPosition(id: $positionId) {\n\t\t\tid\n\t\t\tmentors {\n\t\t\t\tid\n\t\t\t\tavatarUrl\n\t\t\t\tname\n\t\t\t}\n\t\t\torganisation {\n\t\t\t\timageUrl\n\t\t\t\tname\n\t\t\t}\n\t\t\tsummary\n\t\t\tworkplace {\n\t\t\t\tplainAddress\n\t\t\t}\n\t\t}\n\t}\n'];

export function graphql(source: string): unknown;
export function graphql(source: string) {
	return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
	TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
