import { Organisation } from '@prisma/client';

import { handleServiceError } from '~/domain/helpers';
import { AppNotFoundError } from '~/errors';
import { prisma } from '~/prisma';

export interface OrganisationModel extends Organisation {}

export async function getOrganisationById(
  id: string,
): Promise<OrganisationModel> {
  try {
    const organisation = await prisma.organisation.findUnique({
      where: { id },
    });
    if (organisation == null) {
      throw new AppNotFoundError();
    }
    return organisation;
  } catch (error) {
    handleServiceError(error);
  }
}
