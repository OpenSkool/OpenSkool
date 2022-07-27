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

export type AbilityRule = {
  __typename?: 'AbilityRule';
  action: Array<Scalars['String']>;
  conditions?: Maybe<Scalars['JSON']>;
  fields?: Maybe<Array<Scalars['String']>>;
  inverted: Scalars['Boolean'];
  reason?: Maybe<Scalars['String']>;
  subject: Array<Scalars['String']>;
};

/** An accountable resource tracks when and by whom it was created and last updated. */
export type Accountable = {
  createdAt: Scalars['DateTime'];
  createdBy: Person;
  updatedAt: Scalars['DateTime'];
  updatedBy: Person;
};

export type Auth = {
  __typename?: 'Auth';
  abilityRules: Array<AbilityRule>;
  currentUser?: Maybe<CurrentUser>;
};

/** A competency can be an individual competence or a grouping of competences. */
export type Competency = Accountable &
  Node & {
    __typename?: 'Competency';
    createdAt: Scalars['DateTime'];
    createdBy: Person;
    framework: CompetencyFramework;
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

export type Course = Node & {
  __typename?: 'Course';
  id: Scalars['ID'];
  name: Scalars['String'];
  urls: Array<Scalars['String']>;
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
  id: Scalars['ID'];
  name: Scalars['String'];
  tokenSet: TokenSet;
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

/** An internship is part of some courses where the students executes activities within another organisation. */
export type Internship = Node & {
  __typename?: 'Internship';
  availablePositions: Array<InternshipPosition>;
  coordinator: Person;
  course: Course;
  dateFrom: Scalars['DateTime'];
  dateTo: Scalars['DateTime'];
  defaultSupervisor: Person;
  descriptionLong: Scalars['String'];
  descriptionShort: Scalars['String'];
  education: Education;
  id: Scalars['ID'];
  title: Scalars['String'];
  urls: Array<Scalars['String']>;
};

export type InternshipApplication = {
  instance: InternshipInstance;
  position: InternshipPosition;
};

/** An instance of an internship contains all information about the internship of 1 student. It is the link between 1 internship and 1 student. */
export type InternshipInstance = Node & {
  __typename?: 'InternshipInstance';
  applications: Array<InternshipApplication>;
  appliedForPosition: Scalars['Boolean'];
  assignedPosition?: Maybe<InternshipPosition>;
  id: Scalars['ID'];
  internship: Internship;
  student: Person;
  supervisors: Array<Person>;
  urls: Array<Scalars['String']>;
};

/** An instance of an internship contains all information about the internship of 1 student. It is the link between 1 internship and 1 student. */
export type InternshipInstanceAppliedForPositionArgs = {
  id: Scalars['ID'];
};

/** An internship position is one specific position within an organisation to execute an internship. When an organisation can host multiple students for a similar positions, there as many internship positions as there are possible hosted students. */
export type InternshipPosition = Node & {
  __typename?: 'InternshipPosition';
  description: Scalars['String'];
  id: Scalars['ID'];
  mentors: Array<Person>;
  organisation?: Maybe<Organisation>;
  summary: Scalars['String'];
  urls: Array<Scalars['String']>;
  workplace?: Maybe<Workplace>;
};

export type InternshipPriorityApplication = InternshipApplication & {
  __typename?: 'InternshipPriorityApplication';
  instance: InternshipInstance;
  position: InternshipPosition;
  priority: Scalars['Int'];
};

export type Jwt = {
  __typename?: 'JWT';
  expiresAt: Scalars['DateTime'];
  /** This field is for debugging purposes. If you need to know the expiration time of the JWT, use the `expiresAt` field. */
  expiresIn: Scalars['String'];
  /** This field is for debugging purposes. If you need to know the expiration time of the JWT, use the `issuedAt` field. */
  issuedAgo: Scalars['String'];
  issuedAt: Scalars['DateTime'];
  issuer?: Maybe<Scalars['String']>;
  subject?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  applyForPriorityInternshipPosition: InternshipApplication;
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

export type MutationApplyForPriorityInternshipPositionArgs = {
  instanceId: Scalars['ID'];
  positionId: Scalars['ID'];
  priority: Scalars['Int'];
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

/** An organisation can be a commercial company, a non-profit or an educational institution. */
export type Organisation = Node & {
  __typename?: 'Organisation';
  employees: Array<Person>;
  id: Scalars['ID'];
  imageUrl: Scalars['String'];
  name: Scalars['String'];
  plainAddress: Scalars['String'];
  urls: Array<Scalars['String']>;
  workplaces: Array<Workplace>;
};

export type Person = Node & {
  __typename?: 'Person';
  avatarUrl: Scalars['String'];
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
  auth: Auth;
  competency?: Maybe<QueryCompetencyResult>;
  competencyFramework?: Maybe<QueryCompetencyFrameworkResult>;
  internshipInstance?: Maybe<InternshipInstance>;
  internshipPosition?: Maybe<InternshipPosition>;
  myInternshipInstances: Array<InternshipInstance>;
};

export type QueryCompetencyArgs = {
  id: Scalars['ID'];
};

export type QueryCompetencyFrameworkArgs = {
  id: Scalars['ID'];
};

export type QueryInternshipInstanceArgs = {
  id: Scalars['ID'];
};

export type QueryInternshipPositionArgs = {
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

export type TokenSet = {
  __typename?: 'TokenSet';
  accessToken: Jwt;
  idToken: Jwt;
  refreshToken: Jwt;
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

/** This is the location, address where the internship will be executed, */
export type Workplace = Node & {
  __typename?: 'Workplace';
  id: Scalars['ID'];
  plainAddress: Scalars['String'];
};

export type AuthCurrentUserQueryVariables = Exact<{ [key: string]: never }>;

export type AuthCurrentUserQuery = {
  __typename?: 'Query';
  auth: {
    __typename?: 'Auth';
    abilityRules: Array<{
      __typename?: 'AbilityRule';
      action: Array<string>;
      conditions?: any | null;
      fields?: Array<string> | null;
      inverted: boolean;
      reason?: string | null;
      subject: Array<string>;
    }>;
    currentUser?: {
      __typename?: 'CurrentUser';
      id: string;
      name: string;
      tokenSet: {
        __typename?: 'TokenSet';
        refreshToken: { __typename?: 'JWT'; expiresAt: any };
      };
    } | null;
  };
};

export type ManageEditCompetencyQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type ManageEditCompetencyQuery = {
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
        __typename?: 'MutationRenameCompetencySuccess';
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
        __typename?: 'MutationSwapCompetenciesSuccess';
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

export type ManageCompetencyFrameworkListQueryVariables = Exact<{
  [key: string]: never;
}>;

export type ManageCompetencyFrameworkListQuery = {
  __typename?: 'Query';
  allCompetencyFrameworks: Array<{
    __typename?: 'CompetencyFramework';
    id: string;
    title: string;
  }>;
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

export type ManageNestedCompetenciesQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type ManageNestedCompetenciesQuery = {
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
        data: {
          __typename?: 'Competency';
          subCompetencies?: Array<{
            __typename?: 'Competency';
            id: string;
            title: string;
          }> | null;
        };
      }
    | null;
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
          framework: {
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

export type ManageRootCompetenciesQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type ManageRootCompetenciesQuery = {
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
          competencies: Array<{
            __typename?: 'Competency';
            id: string;
            title: string;
          }>;
        };
      }
    | null;
};

export type MainMenuQueryVariables = Exact<{ [key: string]: never }>;

export type MainMenuQuery = {
  __typename?: 'Query';
  myInternshipInstances: Array<{
    __typename?: 'InternshipInstance';
    id: string;
    internship: {
      __typename?: 'Internship';
      id: string;
      course: { __typename?: 'Course'; name: string };
    };
  }>;
};

export type ApplyForInternshipMutationMutationVariables = Exact<{
  instanceId: Scalars['ID'];
  positionId: Scalars['ID'];
  priority: Scalars['Int'];
}>;

export type ApplyForInternshipMutationMutation = {
  __typename?: 'Mutation';
  applyForPriorityInternshipPosition: {
    __typename: 'InternshipPriorityApplication';
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

export type ManageCompetencyCreateNestedCompetencyRouteQueryVariables = Exact<{
  competencyId: Scalars['ID'];
  frameworkId: Scalars['ID'];
}>;

export type ManageCompetencyCreateNestedCompetencyRouteQuery = {
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
        data: {
          __typename?: 'Competency';
          title: string;
          framework: { __typename?: 'CompetencyFramework'; title: string };
        };
      }
    | null;
  competencyFramework?:
    | {
        __typename?: 'NotFoundError';
        code: string;
        message: string;
        path?: Array<string> | null;
      }
    | {
        __typename?: 'QueryCompetencyFrameworkSuccess';
        data: { __typename?: 'CompetencyFramework'; title: string };
      }
    | null;
};

export type ManageCompetencyEditCompetencyRouteQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type ManageCompetencyEditCompetencyRouteQuery = {
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
        data: {
          __typename?: 'Competency';
          title: string;
          framework: { __typename?: 'CompetencyFramework'; title: string };
        };
      }
    | null;
};

export type ManageCompetencyDetailRouteQueryVariables = Exact<{
  competencyId: Scalars['ID'];
  frameworkId: Scalars['ID'];
}>;

export type ManageCompetencyDetailRouteQuery = {
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
        data: {
          __typename?: 'Competency';
          title: string;
          parent?: {
            __typename?: 'Competency';
            id: string;
            title: string;
          } | null;
        };
      }
    | null;
  competencyFramework?:
    | { __typename?: 'NotFoundError' }
    | {
        __typename?: 'QueryCompetencyFrameworkSuccess';
        data: { __typename?: 'CompetencyFramework'; title: string };
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
        __typename?: 'MutationDeleteCompetencySuccess';
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
      }
    | null;
};

export type ManageCompetencyCreateRootCompetencyRouteQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type ManageCompetencyCreateRootCompetencyRouteQuery = {
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
        data: { __typename?: 'CompetencyFramework'; title: string };
      }
    | null;
};

export type ManageCompetencyFrameworkDetailRouteQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type ManageCompetencyFrameworkDetailRouteQuery = {
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

export type InternshipInstanceDetailQueryQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type InternshipInstanceDetailQueryQuery = {
  __typename?: 'Query';
  internshipInstance?: {
    __typename?: 'InternshipInstance';
    id: string;
    internship: {
      __typename?: 'Internship';
      id: string;
      course: { __typename?: 'Course'; name: string };
      availablePositions: Array<{
        __typename?: 'InternshipPosition';
        id: string;
        summary: string;
        organisation?: {
          __typename?: 'Organisation';
          imageUrl: string;
          name: string;
        } | null;
      }>;
    };
  } | null;
};

export type InternshipInstancePositionDetailQueryQueryVariables = Exact<{
  instanceId: Scalars['ID'];
  positionId: Scalars['ID'];
}>;

export type InternshipInstancePositionDetailQueryQuery = {
  __typename?: 'Query';
  internshipInstance?: {
    __typename?: 'InternshipInstance';
    id: string;
    appliedForPosition: boolean;
    internship: {
      __typename?: 'Internship';
      id: string;
      dateFrom: any;
      dateTo: any;
      course: { __typename?: 'Course'; name: string };
    };
  } | null;
  internshipPosition?: {
    __typename?: 'InternshipPosition';
    id: string;
    summary: string;
    mentors: Array<{
      __typename?: 'Person';
      id: string;
      avatarUrl: string;
      name: string;
    }>;
    organisation?: {
      __typename?: 'Organisation';
      imageUrl: string;
      name: string;
    } | null;
    workplace?: { __typename?: 'Workplace'; plainAddress: string } | null;
  } | null;
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
            name: { kind: 'Name', value: 'auth' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
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
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'currentUser' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'tokenSet' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'refreshToken' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'expiresAt' },
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
      },
    },
  ],
} as unknown as DocumentNode<
  AuthCurrentUserQuery,
  AuthCurrentUserQueryVariables
>;
export const ManageEditCompetencyDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'manageEditCompetency' },
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
  ManageEditCompetencyQuery,
  ManageEditCompetencyQueryVariables
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
export const ManageCompetencyFrameworkListDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'ManageCompetencyFrameworkList' },
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
  ManageCompetencyFrameworkListQuery,
  ManageCompetencyFrameworkListQueryVariables
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
export const ManageNestedCompetenciesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'manageNestedCompetencies' },
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
  ManageNestedCompetenciesQuery,
  ManageNestedCompetenciesQueryVariables
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
                              name: { kind: 'Name', value: 'framework' },
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
export const ManageRootCompetenciesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'manageRootCompetencies' },
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
  ManageRootCompetenciesQuery,
  ManageRootCompetenciesQueryVariables
>;
export const MainMenuDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'MainMenu' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'myInternshipInstances' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'internship' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'course' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
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
} as unknown as DocumentNode<MainMenuQuery, MainMenuQueryVariables>;
export const ApplyForInternshipMutationDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'ApplyForInternshipMutation' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'instanceId' },
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
            name: { kind: 'Name', value: 'positionId' },
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
            name: { kind: 'Name', value: 'priority' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'applyForPriorityInternshipPosition' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'instanceId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'instanceId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'positionId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'positionId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'priority' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'priority' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ApplyForInternshipMutationMutation,
  ApplyForInternshipMutationMutationVariables
>;
export const ManageCompetencyCreateNestedCompetencyRouteDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: {
        kind: 'Name',
        value: 'manageCompetencyCreateNestedCompetencyRoute',
      },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'competencyId' },
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
            name: { kind: 'Name', value: 'frameworkId' },
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
            name: { kind: 'Name', value: 'competency' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'competencyId' },
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
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'framework' },
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
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'competencyFramework' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'frameworkId' },
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
  ManageCompetencyCreateNestedCompetencyRouteQuery,
  ManageCompetencyCreateNestedCompetencyRouteQueryVariables
>;
export const ManageCompetencyEditCompetencyRouteDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'manageCompetencyEditCompetencyRoute' },
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
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'framework' },
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
  ManageCompetencyEditCompetencyRouteQuery,
  ManageCompetencyEditCompetencyRouteQueryVariables
>;
export const ManageCompetencyDetailRouteDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'manageCompetencyDetailRoute' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'competencyId' },
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
            name: { kind: 'Name', value: 'frameworkId' },
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
            name: { kind: 'Name', value: 'competency' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'competencyId' },
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
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'competencyFramework' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'frameworkId' },
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
        ],
      },
    },
    ...BaseErrorFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<
  ManageCompetencyDetailRouteQuery,
  ManageCompetencyDetailRouteQueryVariables
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
export const ManageCompetencyCreateRootCompetencyRouteDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: {
        kind: 'Name',
        value: 'manageCompetencyCreateRootCompetencyRoute',
      },
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
  ManageCompetencyCreateRootCompetencyRouteQuery,
  ManageCompetencyCreateRootCompetencyRouteQueryVariables
>;
export const ManageCompetencyFrameworkDetailRouteDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'manageCompetencyFrameworkDetailRoute' },
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
  ManageCompetencyFrameworkDetailRouteQuery,
  ManageCompetencyFrameworkDetailRouteQueryVariables
>;
export const InternshipInstanceDetailQueryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'InternshipInstanceDetailQuery' },
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
            name: { kind: 'Name', value: 'internshipInstance' },
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
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'internship' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'course' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'availablePositions' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'summary' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'organisation' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'imageUrl' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'name' },
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
      },
    },
  ],
} as unknown as DocumentNode<
  InternshipInstanceDetailQueryQuery,
  InternshipInstanceDetailQueryQueryVariables
>;
export const InternshipInstancePositionDetailQueryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'InternshipInstancePositionDetailQuery' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'instanceId' },
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
            name: { kind: 'Name', value: 'positionId' },
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
            name: { kind: 'Name', value: 'internshipInstance' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'instanceId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'appliedForPosition' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'id' },
                      value: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'positionId' },
                      },
                    },
                  ],
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'internship' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'course' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'dateFrom' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'dateTo' },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'internshipPosition' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'positionId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'mentors' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'avatarUrl' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'organisation' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'imageUrl' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'summary' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'workplace' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'plainAddress' },
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
} as unknown as DocumentNode<
  InternshipInstancePositionDetailQueryQuery,
  InternshipInstancePositionDetailQueryQueryVariables
>;
