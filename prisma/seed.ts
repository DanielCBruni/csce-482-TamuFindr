import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import { randomUUID } from 'node:crypto';

import { categories } from './seed-data/categories';
import { locations } from './seed-data/locations';
import { items } from './seed-data/items';
import { users } from './seed-data/users';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding categories...');
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log('Seeding locations...');
  for (const loc of locations) {
    await prisma.location.upsert({
      where: { name: loc.name },
      update: {
        abbreviation: loc.abbreviation,
        latitude: loc.latitude,
        longitude: loc.longitude,
      },
      create: loc,
    });
  }

  console.log('Seeding users...');
  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        id: randomUUID(),
        ...user,
      },
    });
  }

  console.log('Seeding items...');
  for (const item of items) {
    const { userEmail, categoryName, locationName, ...data } = item;

    await prisma.item.upsert({
      where: { id: data.id },
      update: {},
      create: {
        ...data,
        submitter: { connect: { email: userEmail } },
        category: { connect: { name: categoryName } },
        location: { connect: { name: locationName } },
      },
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
