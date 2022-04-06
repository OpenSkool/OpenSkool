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
export type Competency = {
  createdAt: Scalars['DateTime'];
  createdBy: Person;
  /** A CUID for a resource */
  id: Scalars['ID'];
  subCompetencies?: Maybe<Array<NestedCompetency>>;
  title: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  updatedBy: Person;
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
  createEducation?: Maybe<Education>;
  deleteCompetency?: Maybe<Competency>;
  deleteEducation?: Maybe<Education>;
  renameCompetency: RenameCompetencyPayload;
  updateEducation?: Maybe<Education>;
};

export type MutationCreateCompetencyArgs = {
  data: CreateCompetencyInput;
};

export type MutationCreateEducationArgs = {
  data: EducationInput;
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

/** A competency with a parent. */
export type NestedCompetency = Accountable &
  Competency &
  Node & {
    __typename?: 'NestedCompetency';
    createdAt: Scalars['DateTime'];
    createdBy: Person;
    /** A CUID for a resource */
    id: Scalars['ID'];
    parent: Competency;
    subCompetencies?: Maybe<Array<NestedCompetency>>;
    title: Scalars['String'];
    updatedAt: Scalars['DateTime'];
    updatedBy: Person;
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
  allEducations: Array<Education>;
  allPeople: Array<Person>;
  allRootCompetencies: Array<RootCompetency>;
  competency?: Maybe<Competency>;
};

export type QueryCompetencyArgs = {
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

/** A competency without a parent. */
export type RootCompetency = Accountable &
  Competency &
  Node & {
    __typename?: 'RootCompetency';
    createdAt: Scalars['DateTime'];
    createdBy: Person;
    /** A CUID for a resource */
    id: Scalars['ID'];
    nestedCompetencies: Array<NestedCompetency>;
    subCompetencies?: Maybe<Array<NestedCompetency>>;
    title: Scalars['String'];
    updatedAt: Scalars['DateTime'];
    updatedBy: Person;
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

export type CreateCompetencyMutationVariables = Exact<{
  data: CreateCompetencyInput;
}>;

export type CreateCompetencyMutation = {
  __typename?: 'Mutation';
  createCompetency:
    | {
        __typename?: 'CreateCompetencySuccessPayload';
        competency:
          | { __typename?: 'NestedCompetency'; id: string }
          | { __typename?: 'RootCompetency'; id: string };
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
        competency:
          | { __typename?: 'NestedCompetency'; id: string }
          | { __typename?: 'RootCompetency'; id: string };
      };
};

export type GetSubCompetenciesQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetSubCompetenciesQuery = {
  __typename?: 'Query';
  competency?:
    | {
        __typename?: 'NestedCompetency';
        id: string;
        title: string;
        parent:
          | { __typename?: 'NestedCompetency'; id: string; title: string }
          | { __typename?: 'RootCompetency'; id: string; title: string };
        subCompetencies?: Array<{
          __typename?: 'NestedCompetency';
          id: string;
          title: string;
        }> | null;
      }
    | {
        __typename?: 'RootCompetency';
        id: string;
        title: string;
        subCompetencies?: Array<{
          __typename?: 'NestedCompetency';
          id: string;
          title: string;
        }> | null;
      }
    | null;
};

export type DeleteCompetencyMutationVariables = Exact<{
  id: Scalars['ID'];
}>;

export type DeleteCompetencyMutation = {
  __typename?: 'Mutation';
  deleteCompetency?:
    | { __typename?: 'NestedCompetency'; id: string }
    | { __typename?: 'RootCompetency'; id: string }
    | null;
};

export type GetAllRootCompetenciesQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetAllRootCompetenciesQuery = {
  __typename?: 'Query';
  allRootCompetencies: Array<{
    __typename?: 'RootCompetency';
    id: string;
    title: string;
  }>;
};

export type GetCompetencyQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetCompetencyQuery = {
  __typename?: 'Query';
  competency?:
    | {
        __typename?: 'NestedCompetency';
        id: string;
        title: string;
        parent:
          | { __typename?: 'NestedCompetency'; id: string }
          | { __typename?: 'RootCompetency'; id: string };
      }
    | { __typename?: 'RootCompetency'; id: string; title: string }
    | null;
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
export const CreateCompetencyDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateCompetency' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'data' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'CreateCompetencyInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createCompetency' },
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
  CreateCompetencyMutation,
  CreateCompetencyMutationVariables
>;
export const RenameCompetencyDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'RenameCompetency' },
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
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'NestedCompetency' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
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
      name: { kind: 'Name', value: 'DeleteCompetency' },
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
export const GetAllRootCompetenciesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetAllRootCompetencies' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'allRootCompetencies' },
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
  GetAllRootCompetenciesQuery,
  GetAllRootCompetenciesQueryVariables
>;
export const GetCompetencyDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getCompetency' },
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
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'NestedCompetency' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
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
  ],
} as unknown as DocumentNode<GetCompetencyQuery, GetCompetencyQueryVariables>;
