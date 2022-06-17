import {
  InternshipService,
  InternshipModel,
  InternshipInstanceModel,
  CourseService,
  InternshipPositionModel,
  OrganisationService,
} from '~/domain';

import builder from '../builder';
import { Course } from './course';
import { Node } from './node';
import { Organisation } from './organisation';

interface GraphConnection<T> {
  edges: T[];
}
interface GraphEdge<T> {
  node: T;
}

export const Internship = builder.objectRef<InternshipModel>('Internship');

export const InternshipInstance =
  builder.objectRef<InternshipInstanceModel>('InternshipInstance');
interface InternshipChosenPositionConnectionModel
  extends GraphConnection<InternshipChosenPositionPriorityEdgeModel> {}

export const InternshipChosenPositionConnection =
  builder.objectRef<InternshipChosenPositionConnectionModel>(
    'InternshipChosenPositionConnection',
  );

export const InternshipChosenPositionEdge = builder.interfaceRef<
  GraphEdge<InternshipPositionModel>
>('InternshipChosenPositionEdge');

interface InternshipChosenPositionPriorityEdgeModel
  extends GraphEdge<InternshipPositionModel> {
  priority: number;
}

export const InternshipChosenPositionPriorityEdge =
  builder.objectRef<InternshipChosenPositionPriorityEdgeModel>(
    'InternshipChosenPositionPriorityEdge',
  );

export const InternshipPosition =
  builder.objectRef<InternshipPositionModel>('InternshipPosition');

builder.objectType(Internship, {
  name: 'Internship',
  interfaces: [Node],
  fields: (t) => ({
    id: t.exposeID('id'),
    course: t.field({
      type: Course,
      async resolve(parent, argumentz, ctx) {
        const course = await CourseService.getCourseById(parent.courseId);
        return course;
      },
    }),
    availablePositions: t.field({
      type: [InternshipPosition],
      async resolve(parent, argumentz, ctx) {
        const positions = await InternshipService.getAvailablePositions(
          parent.id,
        );
        return positions;
      },
    }),
  }),
});

builder.objectType(InternshipInstance, {
  name: 'InternshipInstance',
  interfaces: [Node],
  fields: (t) => ({
    id: t.exposeID('id'),
    internship: t.field({
      type: Internship,
      async resolve(parent) {
        const internship = await InternshipService.getInternshipById(
          parent.internshipId,
        );
        return internship;
      },
    }),
  }),
});

builder.queryField('myInternshipInstances', (t) =>
  t.field({
    type: [InternshipInstance],
    async resolve(parent, argumentz, ctx) {
      return InternshipService.getInternshipInstancesForUser(ctx.domain);
    },
  }),
);

builder.objectType(InternshipPosition, {
  name: 'InternshipPosition',
  interfaces: [Node],
  fields: (t) => ({
    id: t.exposeID('id'),
    summary: t.exposeString('summary'),
    organisation: t.field({
      type: Organisation,
      async resolve(parent) {
        const organisation = await OrganisationService.getOrganisationById(
          parent.organisationId,
        );
        return organisation;
      },
    }),
    internshipInstance: t.field({
      type: InternshipInstance,
      async resolve(parent) {
        const internshipInstance =
          await InternshipService.getInternshipInstanceById(
            parent.internshipInstanceId,
          );
        return internshipInstance;
      },
    }),
  }),
});

builder.objectType(InternshipChosenPositionConnection, {
  name: 'InternshipChosenPositionConnection',
  fields: (t) => ({
    edges: t.expose('edges', {
      type: [InternshipChosenPositionEdge],
    }),
  }),
});

builder.interfaceType(InternshipChosenPositionEdge, {
  name: 'InternshipChosenPositionEdge',
  fields: (t) => ({
    node: t.expose('node', { type: InternshipPosition }),
  }),
});

builder.objectType(InternshipChosenPositionPriorityEdge, {
  name: 'InternshipChosenPositionPriorityEdge',
  interfaces: [InternshipChosenPositionEdge],
  isTypeOf(internshipChosenPositionEdge) {
    return (
      internshipChosenPositionEdge != null &&
      typeof internshipChosenPositionEdge === 'object' &&
      'priority' in internshipChosenPositionEdge
    );
  },
  fields: (t) => ({
    priority: t.exposeInt('priority'),
  }),
});

builder.mutationField('applyForPriorityInternshipPosition', (t) =>
  t.field({
    type: InternshipChosenPositionPriorityEdge,
    args: {
      instanceId: t.arg.id(),
      positionId: t.arg.id(),
      priority: t.arg.int(),
    },
    resolve() {
      throw new Error('TODO mutate apply for intern position');
    },
  }),
);
