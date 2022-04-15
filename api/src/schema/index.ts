import { GraphQLDateTime } from 'graphql-scalars';

import builder from './builder';
import './types'; // eslint-disable-line import/no-unassigned-import

builder.addScalarType('DateTime', GraphQLDateTime, {});

export default builder.toSchema({});
