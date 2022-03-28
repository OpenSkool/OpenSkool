/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */

import type { Context } from './../schema/context';
import type { UserErrorModel } from './../schema/types/errors';
import type { NodeModel } from './../schema/types/interfaces';
import type {
  CreateCompetencyPayloadModel,
  RenameCompetencyPayloadModel,
} from './../schema/types/competency';
import type { CompetencyModel, EducationModel } from './../domain/source-types';
import type { Person } from '@prisma/client';
import type { core } from 'nexus';
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    dateTime<FieldName extends string>(
      fieldName: FieldName,
      opts?: core.CommonInputFieldConfig<TypeName, FieldName>,
    ): void; // "DateTime";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    dateTime<FieldName extends string>(
      fieldName: FieldName,
      ...opts: core.ScalarOutSpread<TypeName, FieldName>
    ): void; // "DateTime";
  }
}

declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  CreateCompetencyInput: {
    // input type
    parentId?: string | null; // ID
    title: string; // String!
  };
  EducationInput: {
    // input type
    title: string; // String!
  };
  RenameCompetencyInput: {
    // input type
    title: string; // String!
  };
}

export interface NexusGenEnums {}

export interface NexusGenScalars {
  String: string;
  Int: number;
  Float: number;
  Boolean: boolean;
  ID: string;
  DateTime: any;
}

export interface NexusGenObjects {
  CreateCompetencyErrorPayload: {
    // root type
    error: NexusGenRootTypes['UserError']; // UserError!
  };
  CreateCompetencySuccessPayload: {
    // root type
    competency: NexusGenRootTypes['Competency']; // Competency!
  };
  Education: EducationModel;
  Mutation: {};
  NestedCompetency: CompetencyModel;
  Query: {};
  RenameCompetencyErrorPayload: {
    // root type
    error: NexusGenRootTypes['UserError']; // UserError!
  };
  RenameCompetencySuccessPayload: {
    // root type
    competency: NexusGenRootTypes['Competency']; // Competency!
  };
  RootCompetency: CompetencyModel;
  Teacher: Person;
  UserError: UserErrorModel;
}

export interface NexusGenInterfaces {
  Accountable:
    | NexusGenRootTypes['Education']
    | NexusGenRootTypes['NestedCompetency']
    | NexusGenRootTypes['RootCompetency'];
  Competency:
    | NexusGenRootTypes['NestedCompetency']
    | NexusGenRootTypes['RootCompetency'];
  Node: NodeModel;
  Person: NexusGenRootTypes['Teacher'];
}

export interface NexusGenUnions {
  CreateCompetencyPayload: CreateCompetencyPayloadModel;
  RenameCompetencyPayload: RenameCompetencyPayloadModel;
}

export type NexusGenRootTypes = NexusGenInterfaces &
  NexusGenObjects &
  NexusGenUnions;

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars;

export interface NexusGenFieldTypes {
  CreateCompetencyErrorPayload: {
    // field return type
    error: NexusGenRootTypes['UserError']; // UserError!
  };
  CreateCompetencySuccessPayload: {
    // field return type
    competency: NexusGenRootTypes['Competency']; // Competency!
  };
  Education: {
    // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    createdBy: NexusGenRootTypes['Person']; // Person!
    id: string; // ID!
    title: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    updatedBy: NexusGenRootTypes['Person']; // Person!
  };
  Mutation: {
    // field return type
    createCompetency: NexusGenRootTypes['CreateCompetencyPayload']; // CreateCompetencyPayload!
    createEducation: NexusGenRootTypes['Education'] | null; // Education
    deleteCompetency: NexusGenRootTypes['Competency'] | null; // Competency
    deleteEducation: NexusGenRootTypes['Education'] | null; // Education
    renameCompetency: NexusGenRootTypes['RenameCompetencyPayload']; // RenameCompetencyPayload!
    updateEducation: NexusGenRootTypes['Education'] | null; // Education
  };
  NestedCompetency: {
    // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    createdBy: NexusGenRootTypes['Person']; // Person!
    id: string; // ID!
    parentId: string; // ID!
    subCompetencies: NexusGenRootTypes['NestedCompetency'][] | null; // [NestedCompetency!]
    title: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    updatedBy: NexusGenRootTypes['Person']; // Person!
  };
  Query: {
    // field return type
    allEducations: NexusGenRootTypes['Education'][]; // [Education!]!
    allPeople: NexusGenRootTypes['Person'][]; // [Person!]!
    allRootCompetencies: NexusGenRootTypes['RootCompetency'][]; // [RootCompetency!]!
    randomCompetency: NexusGenRootTypes['Competency'] | null; // Competency
    randomRootCompetency: NexusGenRootTypes['RootCompetency'] | null; // RootCompetency
    rootCompetency: NexusGenRootTypes['RootCompetency'] | null; // RootCompetency
  };
  RenameCompetencyErrorPayload: {
    // field return type
    error: NexusGenRootTypes['UserError']; // UserError!
  };
  RenameCompetencySuccessPayload: {
    // field return type
    competency: NexusGenRootTypes['Competency']; // Competency!
  };
  RootCompetency: {
    // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    createdBy: NexusGenRootTypes['Person']; // Person!
    id: string; // ID!
    nestedCompetencies: NexusGenRootTypes['NestedCompetency'][]; // [NestedCompetency!]!
    subCompetencies: NexusGenRootTypes['NestedCompetency'][] | null; // [NestedCompetency!]
    title: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    updatedBy: NexusGenRootTypes['Person']; // Person!
  };
  Teacher: {
    // field return type
    firstName: string | null; // String
    id: string; // ID!
    lastName: string | null; // String
  };
  UserError: {
    // field return type
    code: string; // String!
    message: string; // String!
    path: string[]; // [String!]!
  };
  Accountable: {
    // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    createdBy: NexusGenRootTypes['Person']; // Person!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    updatedBy: NexusGenRootTypes['Person']; // Person!
  };
  Competency: {
    // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    createdBy: NexusGenRootTypes['Person']; // Person!
    id: string; // ID!
    subCompetencies: NexusGenRootTypes['NestedCompetency'][] | null; // [NestedCompetency!]
    title: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    updatedBy: NexusGenRootTypes['Person']; // Person!
  };
  Node: {
    // field return type
    id: string; // ID!
  };
  Person: {
    // field return type
    firstName: string | null; // String
    id: string; // ID!
    lastName: string | null; // String
  };
}

export interface NexusGenFieldTypeNames {
  CreateCompetencyErrorPayload: {
    // field return type name
    error: 'UserError';
  };
  CreateCompetencySuccessPayload: {
    // field return type name
    competency: 'Competency';
  };
  Education: {
    // field return type name
    createdAt: 'DateTime';
    createdBy: 'Person';
    id: 'ID';
    title: 'String';
    updatedAt: 'DateTime';
    updatedBy: 'Person';
  };
  Mutation: {
    // field return type name
    createCompetency: 'CreateCompetencyPayload';
    createEducation: 'Education';
    deleteCompetency: 'Competency';
    deleteEducation: 'Education';
    renameCompetency: 'RenameCompetencyPayload';
    updateEducation: 'Education';
  };
  NestedCompetency: {
    // field return type name
    createdAt: 'DateTime';
    createdBy: 'Person';
    id: 'ID';
    parentId: 'ID';
    subCompetencies: 'NestedCompetency';
    title: 'String';
    updatedAt: 'DateTime';
    updatedBy: 'Person';
  };
  Query: {
    // field return type name
    allEducations: 'Education';
    allPeople: 'Person';
    allRootCompetencies: 'RootCompetency';
    randomCompetency: 'Competency';
    randomRootCompetency: 'RootCompetency';
    rootCompetency: 'RootCompetency';
  };
  RenameCompetencyErrorPayload: {
    // field return type name
    error: 'UserError';
  };
  RenameCompetencySuccessPayload: {
    // field return type name
    competency: 'Competency';
  };
  RootCompetency: {
    // field return type name
    createdAt: 'DateTime';
    createdBy: 'Person';
    id: 'ID';
    nestedCompetencies: 'NestedCompetency';
    subCompetencies: 'NestedCompetency';
    title: 'String';
    updatedAt: 'DateTime';
    updatedBy: 'Person';
  };
  Teacher: {
    // field return type name
    firstName: 'String';
    id: 'ID';
    lastName: 'String';
  };
  UserError: {
    // field return type name
    code: 'String';
    message: 'String';
    path: 'String';
  };
  Accountable: {
    // field return type name
    createdAt: 'DateTime';
    createdBy: 'Person';
    updatedAt: 'DateTime';
    updatedBy: 'Person';
  };
  Competency: {
    // field return type name
    createdAt: 'DateTime';
    createdBy: 'Person';
    id: 'ID';
    subCompetencies: 'NestedCompetency';
    title: 'String';
    updatedAt: 'DateTime';
    updatedBy: 'Person';
  };
  Node: {
    // field return type name
    id: 'ID';
  };
  Person: {
    // field return type name
    firstName: 'String';
    id: 'ID';
    lastName: 'String';
  };
}

export interface NexusGenArgTypes {
  Mutation: {
    createCompetency: {
      // args
      currentUserId: string; // ID!
      data: NexusGenInputs['CreateCompetencyInput']; // CreateCompetencyInput!
    };
    createEducation: {
      // args
      data: NexusGenInputs['EducationInput']; // EducationInput!
    };
    deleteCompetency: {
      // args
      id: string; // ID!
    };
    deleteEducation: {
      // args
      id: string; // ID!
    };
    renameCompetency: {
      // args
      currentUserId: string; // ID!
      data: NexusGenInputs['RenameCompetencyInput']; // RenameCompetencyInput!
      id: string; // ID!
    };
    updateEducation: {
      // args
      data: NexusGenInputs['EducationInput']; // EducationInput!
      id: string; // ID!
    };
  };
  Query: {
    rootCompetency: {
      // args
      id: string; // ID!
    };
  };
}

export interface NexusGenAbstractTypeMembers {
  CreateCompetencyPayload:
    | 'CreateCompetencyErrorPayload'
    | 'CreateCompetencySuccessPayload';
  RenameCompetencyPayload:
    | 'RenameCompetencyErrorPayload'
    | 'RenameCompetencySuccessPayload';
  Accountable: 'Education' | 'NestedCompetency' | 'RootCompetency';
  Competency: 'NestedCompetency' | 'RootCompetency';
  Node: 'Education' | 'NestedCompetency' | 'RootCompetency' | 'Teacher';
  Person: 'Teacher';
}

export interface NexusGenTypeInterfaces {
  Education: 'Accountable' | 'Node';
  NestedCompetency: 'Accountable' | 'Competency' | 'Node';
  RootCompetency: 'Accountable' | 'Competency' | 'Node';
  Teacher: 'Node' | 'Person';
  Competency: 'Accountable' | 'Node';
  Person: 'Node';
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = never;

export type NexusGenInterfaceNames = keyof NexusGenInterfaces;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = keyof NexusGenUnions;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType =
  | 'Accountable'
  | 'Competency'
  | 'CreateCompetencyPayload'
  | 'Node'
  | 'Person'
  | 'RenameCompetencyPayload';

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false;
    resolveType: true;
    __typename: false;
  };
};

export interface NexusGenTypes {
  context: Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes:
    | NexusGenTypes['inputNames']
    | NexusGenTypes['enumNames']
    | NexusGenTypes['scalarNames'];
  allOutputTypes:
    | NexusGenTypes['objectNames']
    | NexusGenTypes['enumNames']
    | NexusGenTypes['unionNames']
    | NexusGenTypes['interfaceNames']
    | NexusGenTypes['scalarNames'];
  allNamedTypes:
    | NexusGenTypes['allInputTypes']
    | NexusGenTypes['allOutputTypes'];
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}

declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {}
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {}
  interface NexusGenPluginFieldConfig<
    TypeName extends string,
    FieldName extends string,
  > {}
  interface NexusGenPluginInputFieldConfig<
    TypeName extends string,
    FieldName extends string,
  > {}
  interface NexusGenPluginSchemaConfig {}
  interface NexusGenPluginArgConfig {}
}
