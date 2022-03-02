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
  Date: any;
};

export type Accountable = {
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
};

export type Competency = Accountable & Node & {
  __typename?: 'Competency';
  createdAt: Scalars['Date'];
  /** A CUID for a resource */
  id: Scalars['ID'];
  parentCompetencyId?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  updatedAt: Scalars['Date'];
};

export type Education = Accountable & Node & {
  __typename?: 'Education';
  createdAt: Scalars['Date'];
  /** A CUID for a resource */
  id: Scalars['ID'];
  title: Scalars['String'];
  updatedAt: Scalars['Date'];
};

export type EducationInput = {
  title: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createEducation: Education;
  deleteEducation: Node;
  updateEducation: Education;
};


export type MutationCreateEducationArgs = {
  data: EducationInput;
};


export type MutationDeleteEducationArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateEducationArgs = {
  data: EducationInput;
  id: Scalars['ID'];
};

export type Node = {
  /** A CUID for a resource */
  id: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  allCompetencies: Array<Competency>;
  allEducations: Array<Education>;
};

export type GetEducationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEducationsQuery = { __typename?: 'Query', allEducations: Array<{ __typename?: 'Education', id: string, title: string }> };
