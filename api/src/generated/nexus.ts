/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */

import type * as db from './../api/source-types';
import type { Context } from './../api/context';
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
  EducationInput: {
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
  Education: db.Education;
  Mutation: {};
  NestedCompetency: db.NestedCompetency;
  Query: {};
  RootCompetency: db.RootCompetency;
}

export interface NexusGenInterfaces {
  Accountable:
    | NexusGenRootTypes['Education']
    | NexusGenRootTypes['NestedCompetency']
    | NexusGenRootTypes['RootCompetency'];
  Competency: db.Competency;
  Node: db.Node;
}

export interface NexusGenUnions {}

export type NexusGenRootTypes = NexusGenInterfaces & NexusGenObjects;

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars;

export interface NexusGenFieldTypes {
  Education: {
    // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // ID!
    title: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  };
  Mutation: {
    // field return type
    createEducation: NexusGenRootTypes['Education']; // Education!
    deleteEducation: NexusGenRootTypes['Node']; // Node!
    updateEducation: NexusGenRootTypes['Education']; // Education!
  };
  NestedCompetency: {
    // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // ID!
    parentId: string; // ID!
    title: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  };
  Query: {
    // field return type
    allEducations: NexusGenRootTypes['Education'][]; // [Education!]!
    rootCompetency: NexusGenRootTypes['RootCompetency'] | null; // RootCompetency
  };
  RootCompetency: {
    // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // ID!
    nestedCompetencies: NexusGenRootTypes['NestedCompetency'][]; // [NestedCompetency!]!
    title: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  };
  Accountable: {
    // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  };
  Competency: {
    // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // ID!
    title: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  };
  Node: {
    // field return type
    id: string; // ID!
  };
}

export interface NexusGenFieldTypeNames {
  Education: {
    // field return type name
    createdAt: 'DateTime';
    id: 'ID';
    title: 'String';
    updatedAt: 'DateTime';
  };
  Mutation: {
    // field return type name
    createEducation: 'Education';
    deleteEducation: 'Node';
    updateEducation: 'Education';
  };
  NestedCompetency: {
    // field return type name
    createdAt: 'DateTime';
    id: 'ID';
    parentId: 'ID';
    title: 'String';
    updatedAt: 'DateTime';
  };
  Query: {
    // field return type name
    allEducations: 'Education';
    rootCompetency: 'RootCompetency';
  };
  RootCompetency: {
    // field return type name
    createdAt: 'DateTime';
    id: 'ID';
    nestedCompetencies: 'NestedCompetency';
    title: 'String';
    updatedAt: 'DateTime';
  };
  Accountable: {
    // field return type name
    createdAt: 'DateTime';
    updatedAt: 'DateTime';
  };
  Competency: {
    // field return type name
    createdAt: 'DateTime';
    id: 'ID';
    title: 'String';
    updatedAt: 'DateTime';
  };
  Node: {
    // field return type name
    id: 'ID';
  };
}

export interface NexusGenArgTypes {
  Mutation: {
    createEducation: {
      // args
      data: NexusGenInputs['EducationInput']; // EducationInput!
    };
    deleteEducation: {
      // args
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
  Accountable: 'Education' | 'NestedCompetency' | 'RootCompetency';
  Competency: 'NestedCompetency' | 'RootCompetency';
  Node: 'Education' | 'NestedCompetency' | 'RootCompetency';
}

export interface NexusGenTypeInterfaces {
  Education: 'Accountable' | 'Node';
  NestedCompetency: 'Accountable' | 'Competency' | 'Node';
  RootCompetency: 'Accountable' | 'Competency' | 'Node';
  Competency: 'Accountable' | 'Node';
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = never;

export type NexusGenInterfaceNames = keyof NexusGenInterfaces;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    resolveType: false;
    __typename: false;
    isTypeOf: false;
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
