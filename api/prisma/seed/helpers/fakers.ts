import { faker } from '@faker-js/faker';

export function generateFakeRange(): [Date, Date] {
  const from = generateFutureDate();
  return [from, generateFutureDate(from)];
}

export function generateFutureDate(reference?: Date): Date {
  const date = faker.date.future(1, reference);
  date.setUTCHours(0);
  date.setUTCMinutes(0);
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);
  return date;
}
