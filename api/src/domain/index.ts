import { type AwilixContainer, asClass } from 'awilix';
import plugin from 'fastify-plugin';

import { CompetencyService } from './competency';
import { EducationService } from './education';
import { UserService } from './user';

declare module '@fastify/awilix' {
  interface Cradle {
    competencyService: CompetencyService;
    educationService: EducationService;
    userService: UserService;
  }
}

export const domainPlugin = plugin(async (app) => {
  registerDomainServices(app.diContainer);
});

export function registerDomainServices(container: AwilixContainer): void {
  container.register('competencyService', asClass(CompetencyService));
  container.register('educationService', asClass(EducationService));
  container.register('userService', asClass(UserService));
}

export * from './types.d';

export * as CourseService from './course';
