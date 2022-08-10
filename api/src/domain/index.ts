import { asClass, AwilixContainer } from 'awilix';
import plugin from 'fastify-plugin';

import { CompetencyService } from './competency';
import { EducationService } from './education';

declare module '@fastify/awilix' {
  interface Cradle {
    competencyService: CompetencyService;
    educationService: EducationService;
  }
}

export const domainPlugin = plugin(async (app) => {
  registerDomainServices(app.diContainer);
});

export function registerDomainServices(container: AwilixContainer): void {
  container.register('competencyService', asClass(CompetencyService));
  container.register('educationService', asClass(EducationService));
}

export * from './types.d';

export * as CourseService from './course';
export * as UserService from './user';
