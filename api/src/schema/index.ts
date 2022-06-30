import { GraphQLDateTime, GraphQLJSONObject } from 'graphql-scalars';

import builder from './builder';
import '~/types'; // eslint-disable-line import/no-unassigned-import

builder.addScalarType('DateTime', GraphQLDateTime, {});
builder.addScalarType('JSON', GraphQLJSONObject, {});

export default builder.toSchema({});
