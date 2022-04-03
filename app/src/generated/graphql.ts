export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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

export type CreateCompetencyPayload = CreateCompetencySuccessPayload | UserError;

export type CreateCompetencySuccessPayload = {
  __typename?: 'CreateCompetencySuccessPayload';
  competency: Competency;
};

export type Education = Accountable & Node & {
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
export type NestedCompetency = Accountable & Competency & Node & {
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

export type RenameCompetencyPayload = RenameCompetencySuccessPayload | UserError;

export type RenameCompetencySuccessPayload = {
  __typename?: 'RenameCompetencySuccessPayload';
  competency: Competency;
};

/** A competency without a parent. */
export type RootCompetency = Accountable & Competency & Node & {
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

export type Teacher = Node & Person & {
  __typename?: 'Teacher';
  displayName: Scalars['String'];
  firstName: Scalars['String'];
  /** A CUID for a resource */
  id: Scalars['ID'];
  lastName: Scalars['String'];
};

export type UserError = {
  __typename?: 'UserError';
  code: Scalars['String'];
  message: Scalars['String'];
  path: Array<Scalars['String']>;
};

export type GetPeopleQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPeopleQuery = { __typename?: 'Query', allPeople: Array<{ __typename?: 'Teacher', id: string, displayName: string }> };

export type CreateCompetencyMutationVariables = Exact<{
  data: CreateCompetencyInput;
}>;


export type CreateCompetencyMutation = { __typename?: 'Mutation', createCompetency: { __typename?: 'CreateCompetencySuccessPayload', competency: { __typename?: 'NestedCompetency', id: string } | { __typename?: 'RootCompetency', id: string } } | { __typename?: 'UserError', code: string, message: string, path: Array<string> } };

export type GetCompetencyQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetCompetencyQuery = { __typename?: 'Query', competency?: { __typename?: 'NestedCompetency', id: string, title: string, parent: { __typename?: 'NestedCompetency', id: string } | { __typename?: 'RootCompetency', id: string } } | { __typename?: 'RootCompetency', id: string, title: string } | null };

export type GetEducationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEducationsQuery = { __typename?: 'Query', allEducations: Array<{ __typename?: 'Education', id: string, title: string }> };

export type RenameCompetencyMutationVariables = Exact<{
  id: Scalars['ID'];
  data: RenameCompetencyInput;
}>;


export type RenameCompetencyMutation = { __typename?: 'Mutation', renameCompetency: { __typename?: 'RenameCompetencySuccessPayload', competency: { __typename?: 'NestedCompetency', id: string } | { __typename?: 'RootCompetency', id: string } } | { __typename?: 'UserError', code: string, message: string, path: Array<string> } };

export type GetSubCompetenciesQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetSubCompetenciesQuery = { __typename?: 'Query', competency?: { __typename?: 'NestedCompetency', id: string, title: string, parent: { __typename?: 'NestedCompetency', id: string, title: string } | { __typename?: 'RootCompetency', id: string, title: string }, subCompetencies?: Array<{ __typename?: 'NestedCompetency', id: string, title: string }> | null } | { __typename?: 'RootCompetency', id: string, title: string, subCompetencies?: Array<{ __typename?: 'NestedCompetency', id: string, title: string }> | null } | null };

export type DeleteCompetencyMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteCompetencyMutation = { __typename?: 'Mutation', deleteCompetency?: { __typename?: 'NestedCompetency', id: string } | { __typename?: 'RootCompetency', id: string } | null };

export type GetAllRootCompetenciesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllRootCompetenciesQuery = { __typename?: 'Query', allRootCompetencies: Array<{ __typename?: 'RootCompetency', id: string, title: string }> };
