import { GraphQLDateTime } from 'graphql-scalars';
import { asNexusMethod } from 'nexus';

export const DateTime = asNexusMethod(GraphQLDateTime, 'dateTime');

export * from './competency';
export * from './education';
export * from './interfaces';
