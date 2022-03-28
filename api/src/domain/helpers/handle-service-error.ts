import { handlePrismaError } from '../../prisma';

export function handleServiceError(error: unknown): never {
  handlePrismaError(error);
  throw error as Error;
}
