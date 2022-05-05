import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
};

/** An accountable resource tracks when and by whom it was created and last updated. */
export type Accountable = {
  createdAt: Scalars['DateTime'];
  createdBy: Person;
  updatedAt: Scalars['DateTime'];
  updatedBy: Person;
};

/** A competency can be an individual competence or a grouping of competences. */
export type Competency = Accountable &
  Node & {
    __typename?: 'Competency';
    competencyFramework: CompetencyFramework;
    createdAt: Scalars['DateTime'];
    createdBy: Person;
    /** A CUID for a resource */
    id: Scalars['ID'];
    parent?: Maybe<Competency>;
    subCompetencies?: Maybe<Array<Competency>>;
    title: Scalars['String'];
    updatedAt: Scalars['DateTime'];
    updatedBy: Person;
  };

export type CompetencyFramework = Node & {
  __typename?: 'CompetencyFramework';
  competencies: Array<Competency>;
  /** A CUID for a resource */
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type CreateCompetencyFrameworkInput = {
  title: Scalars['String'];
};

export type CreateNestedCompetencyInput = {
  parentId: Scalars['ID'];
  title: Scalars['String'];
};

export type CreateRootCompetencyInput = {
  frameworkId: Scalars['ID'];
  title: Scalars['String'];
};

/** The currently authenticated user */
export type CurrentUser = Node & {
  __typename?: 'CurrentUser';
  abilityRules: Array<CurrentUserAbilityRule>;
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type CurrentUserAbilityRule = {
  __typename?: 'CurrentUserAbilityRule';
  action: Array<Scalars['String']>;
  conditions?: Maybe<Scalars['JSON']>;
  fields?: Maybe<Array<Scalars['String']>>;
  inverted: Scalars['Boolean'];
  reason?: Maybe<Scalars['String']>;
  subject: Array<Scalars['String']>;
};

export type Education = Accountable &
  Node & {
    __typename?: 'Education';
    createdAt: Scalars['DateTime'];
    createdBy: Person;
    /** A CUID for a resource */
    id: Scalars['ID'];
    title: Scalars['String'];
    updatedAt: Scalars['DateTime'];
    updatedBy: Person;
  };

export type EducationInput = {
  title: Scalars['String'];
};

export type InputError = UserError & {
  __typename?: 'InputError';
  code: Scalars['String'];
  message: Scalars['String'];
  path?: Maybe<Array<Scalars['String']>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createCompetencyFramework: MutationCreateCompetencyFrameworkResult;
  createEducation: MutationCreateEducationResult;
  createNestedCompetency: MutationCreateNestedCompetencyResult;
  createRootCompetency: MutationCreateRootCompetencyResult;
  deleteCompetency?: Maybe<MutationDeleteCompetencyResult>;
  deleteEducation: MutationDeleteEducationResult;
  renameCompetency: MutationRenameCompetencyResult;
  swapCompetencies: MutationSwapCompetenciesResult;
  updateEducation: MutationUpdateEducationResult;
};

export type MutationCreateCompetencyFrameworkArgs = {
  data: CreateCompetencyFrameworkInput;
};

export type MutationCreateEducationArgs = {
  data: EducationInput;
};

export type MutationCreateNestedCompetencyArgs = {
  data: CreateNestedCompetencyInput;
};

export type MutationCreateRootCompetencyArgs = {
  data: CreateRootCompetencyInput;
};

export type MutationDeleteCompetencyArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteEducationArgs = {
  id: Scalars['ID'];
};

export type MutationRenameCompetencyArgs = {
  data: RenameCompetencyInput;
  id: Scalars['ID'];
};

export type MutationSwapCompetenciesArgs = {
  leftCompetencyId: Scalars['ID'];
  rightCompetencyId: Scalars['ID'];
};

export type MutationUpdateEducationArgs = {
  data: EducationInput;
  id: Scalars['ID'];
};

export type MutationCreateCompetencyFrameworkResult =
  | InputError
  | MutationCreateCompetencyFrameworkSuccess
  | UnauthorizedError;

export type MutationCreateCompetencyFrameworkSuccess = {
  __typename?: 'MutationCreateCompetencyFrameworkSuccess';
  data: CompetencyFramework;
};

export type MutationCreateEducationResult = MutationCreateEducationSuccess;

export type MutationCreateEducationSuccess = {
  __typename?: 'MutationCreateEducationSuccess';
  data: Education;
};

export type MutationCreateNestedCompetencyResult =
  | InputError
  | MutationCreateNestedCompetencySuccess
  | NotFoundError
  | UnauthorizedError;

export type MutationCreateNestedCompetencySuccess = {
  __typename?: 'MutationCreateNestedCompetencySuccess';
  data: Competency;
};

export type MutationCreateRootCompetencyResult =
  | InputError
  | MutationCreateRootCompetencySuccess
  | NotFoundError
  | UnauthorizedError;

export type MutationCreateRootCompetencySuccess = {
  __typename?: 'MutationCreateRootCompetencySuccess';
  data: Competency;
};

export type MutationDeleteCompetencyResult =
  | MutationDeleteCompetencySuccess
  | NotFoundError
  | UnauthorizedError;

export type MutationDeleteCompetencySuccess = {
  __typename?: 'MutationDeleteCompetencySuccess';
  data: Competency;
};

export type MutationDeleteEducationResult = MutationDeleteEducationSuccess;

export type MutationDeleteEducationSuccess = {
  __typename?: 'MutationDeleteEducationSuccess';
  data: Education;
};

export type MutationRenameCompetencyResult =
  | InputError
  | MutationRenameCompetencySuccess
  | NotFoundError
  | UnauthorizedError;

export type MutationRenameCompetencySuccess = {
  __typename?: 'MutationRenameCompetencySuccess';
  data: Competency;
};

export type MutationSwapCompetenciesResult =
  | InputError
  | MutationSwapCompetenciesSuccess
  | NotFoundError
  | UnauthorizedError;

export type MutationSwapCompetenciesSuccess = {
  __typename?: 'MutationSwapCompetenciesSuccess';
  data: MutationSwapCompetenciesSuccessData;
};

export type MutationSwapCompetenciesSuccessData = {
  __typename?: 'MutationSwapCompetenciesSuccessData';
  left: Competency;
  right: Competency;
};

export type MutationUpdateEducationResult = MutationUpdateEducationSuccess;

export type MutationUpdateEducationSuccess = {
  __typename?: 'MutationUpdateEducationSuccess';
  data: Education;
};

/** A node is any resource that can be identified via an ID. */
export type Node = {
  /** A CUID for a resource */
  id: Scalars['ID'];
};

export type NotFoundError = UserError & {
  __typename?: 'NotFoundError';
  code: Scalars['String'];
  message: Scalars['String'];
  path?: Maybe<Array<Scalars['String']>>;
};

export type Person = {
  /** A CUID for a resource */
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  allCompetencyFrameworks: Array<CompetencyFramework>;
  allEducations: Array<Education>;
  allPeople: Array<Person>;
  allRootCompetencies: Array<Competency>;
  competency?: Maybe<QueryCompetencyResult>;
  competencyFramework?: Maybe<QueryCompetencyFrameworkResult>;
  currentUser?: Maybe<CurrentUser>;
};

export type QueryCompetencyArgs = {
  id: Scalars['ID'];
};

export type QueryCompetencyFrameworkArgs = {
  id: Scalars['ID'];
};

export type QueryCompetencyFrameworkResult =
  | NotFoundError
  | QueryCompetencyFrameworkSuccess;

export type QueryCompetencyFrameworkSuccess = {
  __typename?: 'QueryCompetencyFrameworkSuccess';
  data: CompetencyFramework;
};

export type QueryCompetencyResult = NotFoundError | QueryCompetencySuccess;

export type QueryCompetencySuccess = {
  __typename?: 'QueryCompetencySuccess';
  data: Competency;
};

export type RenameCompetencyInput = {
  title: Scalars['String'];
};

export type Teacher = Node &
  Person & {
    __typename?: 'Teacher';
    /** A CUID for a resource */
    id: Scalars['ID'];
    name: Scalars['String'];
  };

export type UnauthorizedError = UserError & {
  __typename?: 'UnauthorizedError';
  code: Scalars['String'];
  message: Scalars['String'];
  path?: Maybe<Array<Scalars['String']>>;
};

export type UserError = {
  code: Scalars['String'];
  message: Scalars['String'];
  path?: Maybe<Array<Scalars['String']>>;
};

export type AuthCurrentUserQueryVariables = Exact<{ [key: string]: never }>;

export type AuthCurrentUserQuery = {
  __typename?: 'Query';
  currentUser?: {
    __typename?: 'CurrentUser';
    id: string;
    name: string;
    abilityRules: Array<{
      __typename?: 'CurrentUserAbilityRule';
      action: Array<string>;
      conditions?: any | null;
      fields?: Array<string> | null;
      inverted: boolean;
      reason?: string | null;
      subject: Array<string>;
    }>;
  } | null;
};

export type CreateCompetencyFrameworkMutationVariables = Exact<{
  data: CreateCompetencyFrameworkInput;
}>;

export type CreateCompetencyFrameworkMutation = {
  __typename?: 'Mutation';
  createCompetencyFramework:
    | {
        __typename?: 'InputError';
        code: string;
        message: string;
        path?: Array<string> | null;
      }
    | {
        __typename?: 'MutationCreateCompetencyFrameworkSuccess';
        data: { __typename?: 'CompetencyFramework'; id: string };
      }
    | {
        __typename?: 'UnauthorizedError';
        code: string;
        message: string;
        path?: Array<string> | null;
      };
};

export type CreateNestedCompetencyMutationVariables = Exact<{
  data: CreateNestedCompetencyInput;
}>;

export type CreateNestedCompetencyMutation = {
  __typename?: 'Mutation';
  createNestedCompetency:
    | {
        __typename?: 'InputError';
        code: string;
        message: string;
        path?: Array<string> | null;
      }
    | {
        __typename?: 'MutationCreateNestedCompetencySuccess';
        data: { __typename?: 'Competency'; id: string };
      }
    | {
        __typename?: 'NotFoundError';
        code: string;
        message: string;
        path?: Array<string> | null;
      }
    | {
        __typename?: 'UnauthorizedError';
        code: string;
        message: string;
        path?: Array<string> | null;
      };
};

export type CreateRootCompetencyMutationVariables = Exact<{
  data: CreateRootCompetencyInput;
}>;

export type CreateRootCompetencyMutation = {
  __typename?: 'Mutation';
  createRootCompetency:
    | {
        __typename?: 'InputError';
        code: string;
        message: string;
        path?: Array<string> | null;
      }
    | {
        __typename?: 'MutationCreateRootCompetencySuccess';
        data: {
          __typename?: 'Competency';
          competencyFramework: {
            __typename?: 'CompetencyFramework';
            competencies: Array<{
              __typename?: 'Competency';
              id: string;
              title: string;
            }>;
          };
        };
      }
    | {
        __typename?: 'NotFoundError';
        code: string;
        message: string;
        path?: Array<string> | null;
      }
    | {
        __typename?: 'UnauthorizedError';
        code: string;
        message: string;
        path?: Array<string> | null;
      };
};

export type SwapCompetenciesMutationVariables = Exact<{
  leftCompetencyId: Scalars['ID'];
  rightCompetencyId: Scalars['ID'];
}>;

export type SwapCompetenciesMutation = {
  __typename?: 'Mutation';
  swapCompetencies:
    | {
        __typename?: 'InputError';
        code: string;
        message: string;
        path?: Array<string> | null;
      }
    | {
        __typename: 'MutationSwapCompetenciesSuccess';
        data: {
          __typename?: 'MutationSwapCompetenciesSuccessData';
          left: { __typename?: 'Competency'; id: string };
          right: { __typename?: 'Competency'; id: string };
        };
      }
    | {
        __typename?: 'NotFoundError';
        code: string;
        message: string;
        path?: Array<string> | null;
      }
    | {
        __typename?: 'UnauthorizedError';
        code: string;
        message: string;
        path?: Array<string> | null;
      };
};

type BaseErrorFields_InputError_Fragment = {
  __typename?: 'InputError';
  code: string;
  message: string;
  path?: Array<string> | null;
};

type BaseErrorFields_NotFoundError_Fragment = {
  __typename?: 'NotFoundError';
  code: string;
  message: string;
  path?: Array<string> | null;
};

type BaseErrorFields_UnauthorizedError_Fragment = {
  __typename?: 'UnauthorizedError';
  code: string;
  message: string;
  path?: Array<string> | null;
};

export type BaseErrorFieldsFragment =
  | BaseErrorFields_InputError_Fragment
  | BaseErrorFields_NotFoundError_Fragment
  | BaseErrorFields_UnauthorizedError_Fragment;

export type GetCreateCompetencyParentQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetCreateCompetencyParentQuery = {
  __typename?: 'Query';
  competency?:
    | {
        __typename?: 'NotFoundError';
        code: string;
        message: string;
        path?: Array<string> | null;
      }
    | {
        __typename?: 'QueryCompetencySuccess';
        data: { __typename?: 'Competency'; title: string };
      }
    | null;
};

export type GetEditCompetencyQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetEditCompetencyQuery = {
  __typename?: 'Query';
  competency?:
    | {
        __typename: 'NotFoundError';
        code: string;
        message: string;
        path?: Array<string> | null;
      }
    | {
        __typename: 'QueryCompetencySuccess';
        data: { __typename?: 'Competency'; title: string };
      }
    | null;
};

export type RenameCompetencyMutationVariables = Exact<{
  id: Scalars['ID'];
  data: RenameCompetencyInput;
}>;

export type RenameCompetencyMutation = {
  __typename?: 'Mutation';
  renameCompetency:
    | {
        __typename: 'InputError';
        code: string;
        message: string;
        path?: Array<string> | null;
      }
    | {
        __typename: 'MutationRenameCompetencySuccess';
        data: { __typename?: 'Competency'; id: string };
      }
    | {
        __typename: 'NotFoundError';
        code: string;
        message: string;
        path?: Array<string> | null;
      }
    | {
        __typename: 'UnauthorizedError';
        code: string;
        message: string;
        path?: Array<string> | null;
      };
};

export type GetSubCompetenciesQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetSubCompetenciesQuery = {
  __typename?: 'Query';
  competency?:
    | {
        __typename: 'NotFoundError';
        code: string;
        message: string;
        path?: Array<string> | null;
      }
    | {
        __typename: 'QueryCompetencySuccess';
        data: {
          __typename?: 'Competency';
          id: string;
          title: string;
          competencyFramework: {
            __typename?: 'CompetencyFramework';
            id: string;
            title: string;
          };
          parent?: {
            __typename?: 'Competency';
            id: string;
            title: string;
          } | null;
          subCompetencies?: Array<{
            __typename?: 'Competency';
            id: string;
            title: string;
          }> | null;
        };
      }
    | null;
};

export type DeleteCompetencyMutationVariables = Exact<{
  id: Scalars['ID'];
}>;

export type DeleteCompetencyMutation = {
  __typename?: 'Mutation';
  deleteCompetency?:
    | {
        __typename: 'MutationDeleteCompetencySuccess';
        data: { __typename?: 'Competency'; id: string };
      }
    | {
        __typename: 'NotFoundError';
        code: string;
        message: string;
        path?: Array<string> | null;
      }
    | {
        __typename: 'UnauthorizedError';
        code: string;
        message: string;
        path?: Array<string> | null;
      }
    | null;
};

export type GetCompetencyFrameworkQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetCompetencyFrameworkQuery = {
  __typename?: 'Query';
  competencyFramework?:
    | {
        __typename?: 'NotFoundError';
        code: string;
        message: string;
        path?: Array<string> | null;
      }
    | {
        __typename?: 'QueryCompetencyFrameworkSuccess';
        data: { __typename?: 'CompetencyFramework'; id: string; title: string };
      }
    | null;
};

export type GetFrameworkRootCompetenciesQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetFrameworkRootCompetenciesQuery = {
  __typename?: 'Query';
  competencyFramework?:
    | {
        __typename?: 'NotFoundError';
        code: string;
        message: string;
        path?: Array<string> | null;
      }
    | {
        __typename?: 'QueryCompetencyFrameworkSuccess';
        data: {
          __typename?: 'CompetencyFramework';
          id: string;
          title: string;
          competencies: Array<{
            __typename?: 'Competency';
            id: string;
            title: string;
          }>;
        };
      }
    | null;
};

export type GetAllCompetencyFrameworksQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetAllCompetencyFrameworksQuery = {
  __typename?: 'Query';
  allCompetencyFrameworks: Array<{
    __typename?: 'CompetencyFramework';
    id: string;
    title: string;
  }>;
};

export const BaseErrorFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'BaseErrorFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'UserError' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'code' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
          { kind: 'Field', name: { kind: 'Name', value: 'path' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<BaseErrorFieldsFragment, unknown>;
export const AuthCurrentUserDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'authCurrentUser' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'currentUser' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'abilityRules' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'action' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'conditions' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'fields' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'inverted' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'reason' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'subject' },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  AuthCurrentUserQuery,
  AuthCurrentUserQueryVariables
>;
export const CreateCompetencyFrameworkDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateCompetencyFramework' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'data' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'CreateCompetencyFrameworkInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createCompetencyFramework' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'data' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'data' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: {
                      kind: 'Name',
                      value: 'MutationCreateCompetencyFrameworkSuccess',
                    },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'data' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'BaseErrorFields' },
                },
              ],
            },
          },
        ],
      },
    },
    ...BaseErrorFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  CreateCompetencyFrameworkMutation,
  CreateCompetencyFrameworkMutationVariables
>;
export const CreateNestedCompetencyDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateNestedCompetency' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'data' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'CreateNestedCompetencyInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createNestedCompetency' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'data' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'data' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: {
                      kind: 'Name',
                      value: 'MutationCreateNestedCompetencySuccess',
                    },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'data' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'BaseErrorFields' },
                },
              ],
            },
          },
        ],
      },
    },
    ...BaseErrorFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  CreateNestedCompetencyMutation,
  CreateNestedCompetencyMutationVariables
>;
export const CreateRootCompetencyDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateRootCompetency' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'data' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'CreateRootCompetencyInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createRootCompetency' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'data' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'data' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: {
                      kind: 'Name',
                      value: 'MutationCreateRootCompetencySuccess',
                    },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'data' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'competencyFramework',
                              },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'competencies',
                                    },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'id' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'title',
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'BaseErrorFields' },
                },
              ],
            },
          },
        ],
      },
    },
    ...BaseErrorFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  CreateRootCompetencyMutation,
  CreateRootCompetencyMutationVariables
>;
export const SwapCompetenciesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'swapCompetencies' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'leftCompetencyId' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'rightCompetencyId' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'swapCompetencies' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'leftCompetencyId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'leftCompetencyId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'rightCompetencyId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'rightCompetencyId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: {
                      kind: 'Name',
                      value: 'MutationSwapCompetenciesSuccess',
                    },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: '__typename' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'data' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'left' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'right' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'BaseErrorFields' },
                },
              ],
            },
          },
        ],
      },
    },
    ...BaseErrorFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  SwapCompetenciesMutation,
  SwapCompetenciesMutationVariables
>;
export const GetCreateCompetencyParentDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getCreateCompetencyParent' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'competency' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'QueryCompetencySuccess' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'data' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'title' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'BaseErrorFields' },
                },
              ],
            },
          },
        ],
      },
    },
    ...BaseErrorFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  GetCreateCompetencyParentQuery,
  GetCreateCompetencyParentQueryVariables
>;
export const GetEditCompetencyDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getEditCompetency' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'competency' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'QueryCompetencySuccess' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'data' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'title' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'BaseErrorFields' },
                },
              ],
            },
          },
        ],
      },
    },
    ...BaseErrorFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  GetEditCompetencyQuery,
  GetEditCompetencyQueryVariables
>;
export const RenameCompetencyDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'renameCompetency' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'data' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'RenameCompetencyInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'renameCompetency' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'data' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'data' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: {
                      kind: 'Name',
                      value: 'MutationRenameCompetencySuccess',
                    },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'data' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'BaseErrorFields' },
                },
              ],
            },
          },
        ],
      },
    },
    ...BaseErrorFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  RenameCompetencyMutation,
  RenameCompetencyMutationVariables
>;
export const GetSubCompetenciesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getSubCompetencies' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'competency' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'QueryCompetencySuccess' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'data' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'title' },
                            },
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'competencyFramework',
                              },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'title' },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'parent' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'title' },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'subCompetencies' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'title' },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'BaseErrorFields' },
                },
              ],
            },
          },
        ],
      },
    },
    ...BaseErrorFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  GetSubCompetenciesQuery,
  GetSubCompetenciesQueryVariables
>;
export const DeleteCompetencyDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'deleteCompetency' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteCompetency' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: {
                      kind: 'Name',
                      value: 'MutationDeleteCompetencySuccess',
                    },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'data' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'BaseErrorFields' },
                },
              ],
            },
          },
        ],
      },
    },
    ...BaseErrorFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  DeleteCompetencyMutation,
  DeleteCompetencyMutationVariables
>;
export const GetCompetencyFrameworkDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getCompetencyFramework' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'competencyFramework' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: {
                      kind: 'Name',
                      value: 'QueryCompetencyFrameworkSuccess',
                    },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'data' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'title' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'BaseErrorFields' },
                },
              ],
            },
          },
        ],
      },
    },
    ...BaseErrorFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  GetCompetencyFrameworkQuery,
  GetCompetencyFrameworkQueryVariables
>;
export const GetFrameworkRootCompetenciesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getFrameworkRootCompetencies' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'competencyFramework' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: {
                      kind: 'Name',
                      value: 'QueryCompetencyFrameworkSuccess',
                    },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'data' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'title' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'competencies' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'title' },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'BaseErrorFields' },
                },
              ],
            },
          },
        ],
      },
    },
    ...BaseErrorFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  GetFrameworkRootCompetenciesQuery,
  GetFrameworkRootCompetenciesQueryVariables
>;
export const GetAllCompetencyFrameworksDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetAllCompetencyFrameworks' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'allCompetencyFrameworks' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'title' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetAllCompetencyFrameworksQuery,
  GetAllCompetencyFrameworksQueryVariables
>;
