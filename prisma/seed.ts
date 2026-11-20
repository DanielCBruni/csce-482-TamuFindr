import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import { randomUUID } from 'node:crypto';

import { categories } from './seed-data/categories';
import { itemKinds } from './seed-data/itemKinds';
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

  console.log('Seeding item kinds...');

  for (const itemKind of itemKinds) {
    const { categoryName, ...itemKindData } = itemKind;

    await prisma.itemKind.upsert({
      where: {
        slug: itemKindData.slug,
      },
      update: {
        name: itemKindData.name,
        category: {
          connect: {
            name: categoryName,
          },
        },
      },
      create: {
        ...itemKindData,
        category: {
          connect: {
            name: categoryName,
          },
        },
      },
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
    const {
      userEmail,
      categoryName,
      itemKindSlug,
      locationName,
      ...itemData
    } = item;

    const relations = {
      submitter: {
        connect: {
          email: userEmail,
        },
      },
      category: {
        connect: {
          name: categoryName,
        },
      },
      location: {
        connect: {
          name: locationName,
        },
      },
      itemKind: {
        connect: {
          slug: itemKindSlug,
        },
      },
    };

    await prisma.item.upsert({
      where: {
        id: itemData.id,
      },

      // This lets re-running the seed update relations for already-existing
      // seed records, including the new ItemKind relation.
      update: {
        ...relations,
      },

      create: {
        ...itemData,
        ...relations,
      },
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });