import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const categories = [
  { name: 'Electronics & Gadgets' },
  { name: 'Water Bottles & Tumblers' },
  { name: 'Keys & Keychains' },
  { name: 'Backpacks & Bags' },
  { name: 'Wallets & IDs' },
  { name: 'Apparel & Accessories' },
  { name: 'Eyewear & Sunglasses' },
  { name: 'Books & Course Materials' },
  { name: 'Jewelry & Watches' },
];

const locations = [
  { name: 'Academic Building', abbreviation: 'ACAD' },
  { name: 'Memorial Student Center', abbreviation: 'MSCB' },
  { name: 'Zachry Engineering Education Complex', abbreviation: 'ZACH' },
  { name: 'Sterling C. Evans Library', abbreviation: 'EVAN' },
  { name: 'Blocker Building', abbreviation: 'BLOC' },
  { name: 'Wisenbaker Engineering Building', abbreviation: 'WEB' },
  { name: 'Emerging Technologies Building', abbreviation: 'ETB' },
  { name: 'Jack E. Brown Chemical Engineering Building', abbreviation: 'CHEN' },
  { name: 'Student Recreation Center', abbreviation: 'REC' },
  { name: 'Heldenfels Hall', abbreviation: 'HELD' },
  { name: 'Harrington Education Center', abbreviation: 'HECC' },
  { name: 'Agriculture and Life Sciences Building', abbreviation: 'AGLS' },
  { name: 'Interdisciplinary Life Sciences Building', abbreviation: 'ILSB' },
  { name: 'Mitchell Physics Building', abbreviation: 'MPHY' },
  { name: 'Wehner Building', abbreviation: 'WCBA' },
  { name: 'Allen Building', abbreviation: 'ALLN' },
  { name: 'John J. Koldus Building', abbreviation: 'KOLD' },
  { name: 'Polo Road Garage', abbreviation: 'PRG' },
  { name: 'Central Campus Parking Garage', abbreviation: 'CCPG' },
  { name: 'Northside Parking Garage', abbreviation: 'NSPG' },
  { name: 'Harvey R. Bright Building', abbreviation: 'HRBB' },
  { name: 'Halbouty Geosciences Building', abbreviation: 'HALB' },
  { name: 'A.P. Beutel Health Center', abbreviation: 'BEUT' },
  { name: 'Sbisa Dining Hall', abbreviation: 'SBIS' },
  { name: 'The Commons', abbreviation: 'COMM' },
];



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
  for (const location of locations) {
    await prisma.location.upsert({
      where: { name: location.name },
      update: { abbreviation: location.abbreviation },
      create: location,
    });
  }

  const defaultUser = await prisma.user.upsert({
    where: { email: 'testuser@tamu.edu' },
    update: {},
    create: {
      id: 'sample-user-id',
      email: 'testuser@tamu.edu',
      firstName: 'Miss',
      lastName: 'Rev',
      passwordHash: 'hashed_password_here',
      role: 'USER',
    },
  });

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