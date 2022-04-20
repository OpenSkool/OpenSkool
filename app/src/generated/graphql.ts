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
};

/** An accountable resource tracks when and by whom it was created and last updated. */
export type Accountable = {
  createdAt: Scalars['DateTime'];
  createdBy: Person;
  updatedAt: Scalars['DateTime'];
  updatedBy: Person;
};

export type BaseError = {
  code: Scalars['String'];
  message: Scalars['String'];
  path?: Maybe<Array<Scalars['String']>>;
};

/** A competency can be an individual competence or a grouping of competences. */
export type Competency = Accountable &
  Node & {
    __typename?: 'Competency';
    competencyFramework?: Maybe<CompetencyFramework>;
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

export type CreateCompetencyFrameworkPayload =
  | CreateCompetencyFrameworkSuccessPayload
  | InputError;

export type CreateCompetencyFrameworkSuccessPayload = {
  __typename?: 'CreateCompetencyFrameworkSuccessPayload';
  competencyFramework: CompetencyFramework;
};

export type CreateCompetencyInput = {
  parentId?: InputMaybe<Scalars['ID']>;
  title: Scalars['String'];
};

export type CreateCompetencyPayload =
  | CreateCompetencySuccessPayload
  | InputError;

export type CreateCompetencySuccessPayload = {
  __typename?: 'CreateCompetencySuccessPayload';
  competency: Competency;
};

export type CreateNestedCompetencyInput = {
  parentId: Scalars['ID'];
  title: Scalars['String'];
};

export type CreateRootCompetencyInput = {
  frameworkId: Scalars['ID'];
  title: Scalars['String'];
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

export type InputError = BaseError & {
  __typename?: 'InputError';
  code: Scalars['String'];
  message: Scalars['String'];
  path?: Maybe<Array<Scalars['String']>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createCompetency: CreateCompetencyPayload;
  createCompetencyFramework: CreateCompetencyFrameworkPayload;
  createEducation?: Maybe<Education>;
  createNestedCompetency: CreateCompetencyPayload;
  createRootCompetency: CreateCompetencyPayload;
  deleteCompetency?: Maybe<Competency>;
  deleteEducation?: Maybe<Education>;
  renameCompetency: RenameCompetencyPayload;
  updateEducation?: Maybe<Education>;
};

export type MutationCreateCompetencyArgs = {
  data: CreateCompetencyInput;
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

export type MutationUpdateEducationArgs = {
  data: EducationInput;
  id: Scalars['ID'];
};

/** A node is any resource that can be identified via an ID. */
export type Node = {
  /** A CUID for a resource */
  id: Scalars['ID'];
};

export type Person = {
  displayName: Scalars['String'];
  firstName: Scalars['String'];
  /** A CUID for a resource */
  id: Scalars['ID'];
  lastName: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  allCompetencyFrameworks: Array<CompetencyFramework>;
  allEducations: Array<Education>;
  allPeople: Array<Person>;
  allRootCompetencies: Array<Competency>;
  competency?: Maybe<Competency>;
  competencyFramework?: Maybe<CompetencyFramework>;
};

export type QueryCompetencyArgs = {
  id: Scalars['ID'];
};

export type QueryCompetencyFrameworkArgs = {
  id: Scalars['ID'];
};

export type RenameCompetencyInput = {
  title: Scalars['String'];
};

export type RenameCompetencyPayload =
  | InputError
  | RenameCompetencySuccessPayload;

export type RenameCompetencySuccessPayload = {
  __typename?: 'RenameCompetencySuccessPayload';
  competency: Competency;
};

export type Teacher = Node &
  Person & {
    __typename?: 'Teacher';
    displayName: Scalars['String'];
    firstName: Scalars['String'];
    /** A CUID for a resource */
    id: Scalars['ID'];
    lastName: Scalars['String'];
  };

export type GetPeopleQueryVariables = Exact<{ [key: string]: never }>;

export type GetPeopleQuery = {
  __typename?: 'Query';
  allPeople: Array<{ __typename?: 'Teacher'; id: string; displayName: string }>;
};

export type CreateNestedCompetencyMutationVariables = Exact<{
  data: CreateNestedCompetencyInput;
}>;

export type CreateNestedCompetencyMutation = {
  __typename?: 'Mutation';
  createNestedCompetency:
    | {
        __typename?: 'CreateCompetencySuccessPayload';
        competency: { __typename?: 'Competency'; id: string };
      }
    | {
        __typename?: 'InputError';
        code: string;
        message: string;
        path?: Array<string> | null;
      };
};

export type CreateCompetencyFrameworkMutationVariables = Exact<{
  data: CreateCompetencyFrameworkInput;
}>;

export type CreateCompetencyFrameworkMutation = {
  __typename?: 'Mutation';
  createCompetencyFramework:
    | {
        __typename?: 'CreateCompetencyFrameworkSuccessPayload';
        competencyFramework: { __typename?: 'CompetencyFramework'; id: string };
      }
    | {
        __typename?: 'InputError';
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
        __typename?: 'CreateCompetencySuccessPayload';
        competency: { __typename?: 'Competency'; id: string };
      }
    | {
        __typename?: 'InputError';
        code: string;
        message: string;
        path?: Array<string> | null;
      };
};

export type BaseErrorFieldsFragment = {
  __typename?: 'InputError';
  code: string;
  message: string;
  path?: Array<string> | null;
};

export type GetCreateCompetencyParentQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetCreateCompetencyParentQuery = {
  __typename?: 'Query';
  competency?: { __typename?: 'Competency'; title: string } | null;
};

export type GetEditCompetencyQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetEditCompetencyQuery = {
  __typename?: 'Query';
  competency?: { __typename?: 'Competency'; title: string } | null;
};

export type RenameCompetencyMutationVariables = Exact<{
  id: Scalars['ID'];
  data: RenameCompetencyInput;
}>;

export type RenameCompetencyMutation = {
  __typename?: 'Mutation';
  renameCompetency:
    | {
        __typename?: 'InputError';
        code: string;
        message: string;
        path?: Array<string> | null;
      }
    | {
        __typename?: 'RenameCompetencySuccessPayload';
        competency: { __typename?: 'Competency'; id: string };
      };
};

export type GetSubCompetenciesQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetSubCompetenciesQuery = {
  __typename?: 'Query';
  competency?: {
    __typename?: 'Competency';
    id: string;
    title: string;
    competencyFramework?: {
      __typename?: 'CompetencyFramework';
      id: string;
      title: string;
    } | null;
    parent?: { __typename?: 'Competency'; id: string; title: string } | null;
    subCompetencies?: Array<{
      __typename?: 'Competency';
      id: string;
      title: string;
    }> | null;
  } | null;
};

export type DeleteCompetencyMutationVariables = Exact<{
  id: Scalars['ID'];
}>;

export type DeleteCompetencyMutation = {
  __typename?: 'Mutation';
  deleteCompetency?: { __typename?: 'Competency'; id: string } | null;
};

export type GetCompetencyFrameworkQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetCompetencyFrameworkQuery = {
  __typename?: 'Query';
  competencyFramework?: {
    __typename?: 'CompetencyFramework';
    id: string;
    title: string;
  } | null;
};

export type GetFrameworkRootCompetenciesQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetFrameworkRootCompetenciesQuery = {
  __typename?: 'Query';
  competencyFramework?: {
    __typename?: 'CompetencyFramework';
    id: string;
    title: string;
    competencies: Array<{
      __typename?: 'Competency';
      id: string;
      title: string;
    }>;
  } | null;
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
        name: { kind: 'Name', value: 'BaseError' },
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
export const GetPeopleDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getPeople' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'allPeople' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'displayName' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetPeopleQuery, GetPeopleQueryVariables>;
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
                      value: 'CreateCompetencySuccessPayload',
                    },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'competency' },
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
                      value: 'CreateCompetencyFrameworkSuccessPayload',
                    },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'competencyFramework' },
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
                      value: 'CreateCompetencySuccessPayload',
                    },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'competency' },
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
  CreateRootCompetencyMutation,
  CreateRootCompetencyMutationVariables
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
                { kind: 'Field', name: { kind: 'Name', value: 'title' } },
              ],
            },
          },
        ],
      },
    },
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
                { kind: 'Field', name: { kind: 'Name', value: 'title' } },
              ],
            },
          },
        ],
      },
    },
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
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: {
                      kind: 'Name',
                      value: 'RenameCompetencySuccessPayload',
                    },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'competency' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'competencyFramework' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'parent' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'subCompetencies' },
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
      },
    },
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
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
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
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'competencies' },
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
      },
    },
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
