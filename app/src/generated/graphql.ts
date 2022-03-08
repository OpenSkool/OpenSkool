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

export type CreateCompetencyErrorPayload = {
  __typename?: 'CreateCompetencyErrorPayload';
  error: UserError;
};

export type CreateCompetencyInput = {
  parentId?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
};

export type CreateCompetencyPayload = CreateCompetencyErrorPayload | CreateCompetencySuccessPayload;

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
  deleteCompetency?: Maybe<Node>;
  deleteEducation?: Maybe<Node>;
  updateEducation?: Maybe<Education>;
};


export type MutationCreateCompetencyArgs = {
  currentUserId: Scalars['ID'];
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
  parentId: Scalars['ID'];
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
  firstName?: Maybe<Scalars['String']>;
  /** A CUID for a resource */
  id: Scalars['ID'];
  lastName?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  allEducations: Array<Education>;
  allPeople: Array<Person>;
  allRootCompetencies?: Maybe<Array<Maybe<RootCompetency>>>;
  randomCompetency?: Maybe<RootCompetency>;
  randomRootCompetency?: Maybe<RootCompetency>;
  rootCompetency?: Maybe<RootCompetency>;
};


export type QueryRootCompetencyArgs = {
  id: Scalars['ID'];
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
  firstName?: Maybe<Scalars['String']>;
  /** A CUID for a resource */
  id: Scalars['ID'];
  lastName?: Maybe<Scalars['String']>;
};

export type UserError = {
  __typename?: 'UserError';
  code: Scalars['String'];
  message: Scalars['String'];
  path: Array<Scalars['String']>;
};

export type GetEducationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEducationsQuery = { __typename?: 'Query', allEducations: Array<{ __typename?: 'Education', id: string, title: string }> };
